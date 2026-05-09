'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Login failed — please try again')
        setLoading(false)
        return
      }

      // Write session directly to localStorage — avoids setSession()'s internal
      // /auth/v1/user validation fetch which can fail silently and lose the session.
      const storageKey = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL!
        .replace('https://', '')
        .split('.')[0]}-auth-token`
      localStorage.setItem(storageKey, JSON.stringify({
        access_token: json.access_token,
        refresh_token: json.refresh_token,
        token_type: json.token_type ?? 'bearer',
        expires_in: json.expires_in ?? 3600,
        expires_at: json.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
        user: json.user,
      }))
    } catch (err: any) {
      setError(err.message || 'Network error — please try again')
      setLoading(false)
      return
    }

    const redirect = searchParams.get('redirect') || '/dashboard'
    // Hard navigate so supabase-js reinitialises fresh from localStorage
    window.location.href = redirect
  }

  const inputStyle = {
    width: '100%', background: '#0d0f14', border: '1px solid #2a3040',
    borderRadius: '8px', padding: '11px 14px', color: '#e8eaf0',
    fontSize: '14px', fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0f14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#f59e0b' }}>
              Mech<span style={{ color: '#e8eaf0' }}>IQ</span>
            </span>
          </Link>
          <p style={{ color: '#8892a4', fontSize: '14px', marginTop: '8px' }}>Sign in to your account</p>
        </div>

        <div style={{
          background: '#161a22', border: '1px solid #2a3040',
          borderRadius: '16px', padding: '36px',
        }}>
          <form onSubmit={handleLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8892a4', marginBottom: '6px' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="you@example.com"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2a3040')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8892a4', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = '#f59e0b')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#2a3040')}
                />
              </div>
            </div>

            {error && (
              <div style={{
                marginTop: '16px', padding: '10px 14px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px', color: '#ef4444', fontSize: '13px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-amber"
              style={{ width: '100%', marginTop: '24px', opacity: loading ? 0.7 : 1, textAlign: 'center' }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#8892a4' }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>
              Get started
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#555570' }}>
          <Link href="/" style={{ color: '#555570', textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0d0f14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #2a3040', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
