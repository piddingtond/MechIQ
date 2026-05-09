import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const FREE_LIMIT = 5
const PAID_LIMIT = 500

const SYSTEM_PROMPT = `You are MechIQ — an AI knowledge companion built specifically for UK independent automotive technicians. You are NOT a generic AI assistant.

Your expertise covers:
- Petrol, diesel, hybrid (mild, PHEV, full), and battery-electric vehicle systems
- OBD-II fault codes (P0xxx standard + P1xxx manufacturer-specific), live data interpretation
- UK MOT standards and DVSA requirements
- EV high-voltage safety procedures and battery management systems
- Timing belts/chains, torque specs, service intervals
- ADAS (adaptive cruise, lane assist, AEB) calibration requirements after repairs
- CANBUS, CAN FD, LIN network diagnostics
- Manufacturer TSBs (Technical Service Bulletins) and known faults

How to respond:
- Be direct and practical — the mechanic has a car on the ramp right now
- Use trade language naturally (e.g. "crank sensor", "MAF", "lambda probe", "cam phaser")
- For fault codes: give cause probability ranking (most likely first), what live data to check, and what to rule out before condemning parts
- For torque specs: give the value and specify whether it's dry, oiled, or angle tightening
- Flag safety-critical warnings (HV systems, airbags, brake hydraulics) clearly at the top
- When you're uncertain about a manufacturer-specific detail, say so and suggest cross-referencing with ETKA, Autodata, or TIS
- Keep answers concise — paragraphs not essays
- If a vehicle context is provided, use it throughout your response

You are not a diagnostic system — you cannot read live OBD data directly. You are a knowledge tool. Be honest about this distinction.`

export async function POST(request: NextRequest) {
  try {
    const { messages, vehicle, sessionId } = await request.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    for (const m of messages) {
      if (!m.role || !m.content || typeof m.content !== 'string') {
        return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
      }
      if (m.role !== 'user' && m.role !== 'assistant') {
        return NextResponse.json({ error: 'Invalid message role' }, { status: 400 })
      }
    }

    const supabase = getSupabaseAdmin()

    // Auth via Authorization header (token written to localStorage by login proxy)
    const authHeader = request.headers.get('Authorization') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    let userId: string | null = null
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id ?? null
    }

    let activeSessionId: string | null = sessionId ?? null
    let isNewSession = false

    if (userId) {
      const today = new Date().toISOString().split('T')[0]

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('tier, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      const isPaid = sub && sub.tier !== 'free'
      const dailyLimit = isPaid ? PAID_LIMIT : FREE_LIMIT

      const { data: newCount, error: usageError } = await supabase
        .rpc('increment_query_count', { p_user_id: userId, p_date: today })

      if (!usageError && newCount !== null && newCount > dailyLimit) {
        return NextResponse.json(
          { error: 'Daily query limit reached', limitReached: true },
          { status: 429 }
        )
      }

      // Ensure a session row exists for authenticated users
      isNewSession = !activeSessionId
      if (isNewSession) {
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({ user_id: userId, vehicle: vehicle || null })
          .select('id')
          .single()
        activeSessionId = newSession?.id ?? null
      } else {
        // Update vehicle context and touch updated_at on existing session
        await supabase
          .from('chat_sessions')
          .update({ vehicle: vehicle || null, updated_at: new Date().toISOString() })
          .eq('id', activeSessionId)
          .eq('user_id', userId)
      }
    }

    // Inject vehicle context into the last user message
    const lastMsg = messages[messages.length - 1]
    const contextualMessages = messages.map((m: any, i: number) => {
      if (i === messages.length - 1 && m.role === 'user' && vehicle) {
        return { ...m, content: `[Vehicle: ${vehicle}]\n\n${m.content}` }
      }
      return m
    })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: contextualMessages,
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Persist user message + assistant response for authenticated users
    if (userId && activeSessionId) {
      await supabase.from('chat_messages').insert([
        { session_id: activeSessionId, role: 'user', content: lastMsg.content },
        { session_id: activeSessionId, role: 'assistant', content: content.text },
      ])

      // Auto-generate a title from the first message on new sessions
      if (isNewSession) {
        const firstText = lastMsg.content.slice(0, 120)
        const titleRes = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 24,
          system: 'Generate a 4–6 word title summarising the following automotive query. Plain text only, no punctuation, no quotes.',
          messages: [{ role: 'user', content: firstText }],
        })
        const title = titleRes.content[0]?.type === 'text' ? titleRes.content[0].text.trim() : null
        if (title) {
          await supabase.from('chat_sessions').update({ title }).eq('id', activeSessionId)
        }
      }
    }

    return NextResponse.json({ content: content.text, sessionId: activeSessionId })
  } catch (error) {
    console.error('[mechiq/chat]', error)
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'An error occurred' : String(error) },
      { status: 500 }
    )
  }
}
