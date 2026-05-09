import { NextRequest, NextResponse } from 'next/server'

// Handles Supabase email confirmation redirects.
// Supabase sends: GET /auth/callback?code=xxx
// We exchange the code for a session and redirect to dashboard.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

  const res = await fetch(`${url}/auth/v1/token?grant_type=pkce`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ auth_code: code }),
  })

  if (!res.ok) {
    return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
  }

  const { access_token, refresh_token } = await res.json()

  // Redirect to dashboard with tokens in hash so the client can pick them up
  const redirectTo = new URL(next, origin)
  redirectTo.hash = `access_token=${access_token}&refresh_token=${refresh_token}&type=recovery`

  return NextResponse.redirect(redirectTo.toString())
}
