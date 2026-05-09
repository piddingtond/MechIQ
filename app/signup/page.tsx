'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// credentials:'omit' prevents any existing cookies (including bad ones from
// prior failed auth-helpers attempts) from being sent with Supabase requests,
// which avoids Chrome's ISO-8859-1 header encoding error.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { fetch: (url: RequestInfo | URL, init?: RequestInit) => fetch(url, { ...init, credentials: 'omit' }) } }
)

type Plan = 'individual' | 'team' | 'multi_bay'

const PLANS = [
  { id: 'individual' as Plan, label: 'Individual', price: '£15/mo', seats: '1 mechanic', desc: 'Solo trader or mobile mechanic' },
  { id: 'team' as Plan,       label: 'Garage Team', price: '£35/mo', seats: 'Up to 5', desc: 'Small garage team' },
  { id: 'multi_bay' as Plan,  label: 'Multi-Bay',   price: '£75/mo', seats: 'Unlimited', desc: 'Established multi-bay garage' },
]

function SignupInner() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'plan' | 'details' | 'done'>('plan')
  const [plan, setPlan] = useState<Plan>('individual')
  const [fullName, setFullName] = useState('')
  const [garageName, setGarageName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const p = searchParams.get('plan') as Plan | null
    if (p && PLANS.some(x => x.id === p)) {
      setPlan(p)
      setStep('details')
    }
  }, [searchParams])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, garage_name: garageName, plan },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    // Account created — show success screen.
    // Subscription redirect happens from the pricing page after email confirmation + login.
    setStep('done')
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', background: '#0d0f14', border: '1px solid #2a3040',
    borderRadius: '8px', padding: '11px 14px', color: '#e8eaf0',
    fontSize: '14px', fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s',
  }

  if (step === 'done') {
    return (
      <div style={{
        minHeight: '100vh', background: '#0d0f14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        <div style={{
          width: '100%', maxWidth: '440px', textAlign: 'center',
          background: '#161a22', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '16px', padding: '48px 36px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e8eaf0', marginBottom: '12px' }}>
            Account created!
          </h1>
          <p style={{ color: '#8892a4', fontSize: '14px', lineHeight: 1.65, marginBottom: '28px' }}>
            Check your email to confirm your account, then sign in to start using MechIQ.
          </p>
          <Link href="/login" className="btn-amber" style={{ display: 'inline-block' }}>
            Sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0f14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: step === 'plan' ? '680px' : '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#f59e0b' }}>
              Mech<span style={{ color: '#e8eaf0' }}>IQ</span>
            </span>
          </Link>
          <p style={{ color: '#8892a4', fontSize: '14px', marginTop: '8px' }}>
            {step === 'plan' ? 'Choose a plan to get started' : 'Create your account'}
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {['plan', 'details'].map((s, i) => (
            <div key={s} style={{
              width: '24px', height: '4px', borderRadius: '2px',
              background: (step === 'plan' && i === 0) || (step === 'details' && i <= 1)
                ? '#f59e0b' : '#2a3040',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {step === 'plan' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {PLANS.map(p => {
                const active = plan === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    style={{
                      background: active ? 'rgba(245,158,11,0.08)' : '#161a22',
                      border: `1px solid ${active ? '#f59e0b' : '#2a3040'}`,
                      borderRadius: '12px', padding: '20px 16px',
                      textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      transform: active ? 'scale(1.02)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#e8eaf0', marginBottom: '4px' }}>
                      {p.price}
                    </div>
                    <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600, marginBottom: '6px' }}>
                      {p.seats}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8892a4' }}>{p.desc}</div>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setStep('details')}
              className="btn-amber"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Continue with {PLANS.find(p => p.id === plan)?.label} →
            </button>

            <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: '#555570' }}>
              No credit card required to create an account.
            </p>
          </>
        )}

        {step === 'details' && (
          <div style={{ background: '#161a22', border: '1px solid #2a3040', borderRadius: '16px', padding: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '999px', padding: '4px 14px', fontSize: '12px',
              color: '#f59e0b', fontWeight: 600, marginBottom: '24px',
            }}>
              {PLANS.find(p => p.id === plan)?.label} — {PLANS.find(p => p.id === plan)?.price}
              <button
                onClick={() => setStep('plan')}
                style={{ background: 'none', border: 'none', color: '#8892a4', cursor: 'pointer', fontSize: '11px', marginLeft: '4px', fontFamily: 'inherit' }}
              >
                change
              </button>
            </div>

            <form onSubmit={handleSignup}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8892a4', marginBottom: '6px' }}>
                    Full name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    autoFocus
                    placeholder="Dave Smith"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#f59e0b')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a3040')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8892a4', marginBottom: '6px' }}>
                    Garage name <span style={{ color: '#555570', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={garageName}
                    onChange={e => setGarageName(e.target.value)}
                    placeholder="Smith's Auto Centre"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#f59e0b')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a3040')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8892a4', marginBottom: '6px' }}>
                    Email address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@garage.co.uk"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#f59e0b')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a3040')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8892a4', marginBottom: '6px' }}>
                    Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min 8 characters"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#f59e0b')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#2a3040')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8892a4', marginBottom: '6px' }}>
                    Confirm password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Re-enter your password"
                    style={{
                      ...inputStyle,
                      borderColor: confirmPassword && confirmPassword !== password ? '#ef4444' : '#2a3040',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = confirmPassword !== password ? '#ef4444' : '#f59e0b')}
                    onBlur={e => (e.currentTarget.style.borderColor = confirmPassword && confirmPassword !== password ? '#ef4444' : '#2a3040')}
                  />
                  {confirmPassword && confirmPassword !== password && (
                    <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>Passwords do not match</p>
                  )}
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
                {loading ? 'Creating account…' : 'Create Account →'}
              </button>

              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#555570', lineHeight: 1.5 }}>
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#8892a4' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>
                Sign in
              </Link>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#555570' }}>
          <Link href="/" style={{ color: '#555570', textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0d0f14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #2a3040', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <SignupInner />
    </Suspense>
  )
}
