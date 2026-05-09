import { NextResponse } from 'next/server'

// Auth protection is handled client-side in each page's useEffect.
// Middleware kept minimal — no auth-helpers cookie reads that triggered
// Chrome's ISO-8859-1 header encoding error.
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
