import { createClient } from '@supabase/supabase-js'

// Uses localStorage (not cookies) — avoids the Chrome ISO-8859-1 header encoding error
// that auth-helpers triggers when session tokens contain non-Latin1 characters.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: (url: RequestInfo | URL, init?: RequestInit) =>
        fetch(url, { ...init, credentials: 'omit' }),
    },
  }
)
