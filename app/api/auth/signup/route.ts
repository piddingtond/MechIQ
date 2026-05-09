import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { email, password, full_name, garage_name, plan } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  // Trim to strip any trailing newlines from env vars set via piped CLI commands
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

  if (!url || !key) {
    return NextResponse.json({ error: 'Server configuration error — contact support' }, { status: 500 })
  }

  const supabase = createClient(url, key)

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, garage_name, plan } },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
