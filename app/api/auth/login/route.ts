import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

  let supaRes: Response
  try {
    supaRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        apikey: key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return NextResponse.json({ error: 'Could not reach auth service — please try again' }, { status: 502 })
  }

  const text = await supaRes.text()
  let json: any = {}
  try { json = JSON.parse(text) } catch { /* empty body */ }

  if (!supaRes.ok) {
    const msg = json.error_description || json.msg || json.message || `Login failed (${supaRes.status})`
    return NextResponse.json({ error: msg }, { status: supaRes.status })
  }

  // Return full session so client can store it directly without a setSession() network call
  return NextResponse.json({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    token_type: json.token_type,
    expires_in: json.expires_in,
    expires_at: json.expires_at,
    user: json.user,
  })
}
