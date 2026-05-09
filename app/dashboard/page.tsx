'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

type Subscription = {
  tier: string
  status: string
  current_period_end: string | null
}

type QueryUsage = {
  count: number
}

type ChatSession = {
  id: string
  title: string | null
  vehicle: { make?: string; model?: string; year?: string; engine?: string } | null
  created_at: string
  updated_at: string
}

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  individual: 'Individual',
  team: 'Garage Team',
  multi_bay: 'Multi-Bay',
}

const TIER_LIMITS: Record<string, number> = {
  free: 5,
  individual: 500,
  team: 500,
  multi_bay: 500,
}

const TIER_PRICES: Record<string, string> = {
  free: 'Free',
  individual: '£15/mo',
  team: '£35/mo',
  multi_bay: '£75/mo',
}

const BG = '#0d0f14'
const SURFACE = '#161a22'
const SURFACE2 = '#1e2330'
const BORDER = '#2a3040'
const AMBER = '#f59e0b'
const MUTED = '#8892a4'
const TEXT = '#e8eaf0'

function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [sub, setSub] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<QueryUsage | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    if (searchParams.get('subscribed') === '1') {
      toast.success('Subscription active — welcome aboard!')
    }
  }, [])

  useEffect(() => {
    async function load() {
      // supabase.auth.getSession() can return null in v2.43 if its internal
      // validation fetch fails — fall back to reading localStorage directly.
      let { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        try {
          const key = `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]}-auth-token`
          const raw = localStorage.getItem(key)
          if (raw) session = JSON.parse(raw)
        } catch { /* ignore */ }
      }
      if (!session) { router.replace('/login'); return }
      setUser(session.user)

      const today = new Date().toISOString().split('T')[0]

      const [subRes, usageRes, sessionsRes] = await Promise.all([
        supabase.from('subscriptions').select('tier, status, current_period_end')
          .eq('user_id', session.user.id).eq('status', 'active').maybeSingle(),
        supabase.from('query_usage').select('count')
          .eq('user_id', session.user.id).eq('date', today).maybeSingle(),
        supabase.from('chat_sessions').select('id, title, vehicle, created_at, updated_at')
          .eq('user_id', session.user.id).order('updated_at', { ascending: false }).limit(20),
      ])

      setSub(subRes.data ?? { tier: 'free', status: 'free', current_period_end: null })
      setUsage(usageRes.data ?? { count: 0 })
      setSessions(sessionsRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/')
  }

  async function handleUpgrade(plan: 'individual' | 'team' | 'multi_bay') {
    setUpgrading(true)
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setUpgrading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: `2px solid ${BORDER}`, borderTopColor: AMBER, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tier = sub?.tier ?? 'free'
  const dailyLimit = TIER_LIMITS[tier] ?? 5
  const usedToday = usage?.count ?? 0
  const usagePct = Math.min((usedToday / dailyLimit) * 100, 100)
  const isPaid = tier !== 'free'
  const initials = (user?.email ?? 'U')[0].toUpperCase()

  function vehicleLabel(s: ChatSession) {
    const v = s.vehicle
    if (!v || !v.make) return 'No vehicle set'
    return [v.year, v.make, v.model, v.engine ? `(${v.engine})` : ''].filter(Boolean).join(' ')
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: SURFACE }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: AMBER, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 900, fontSize: '14px' }}>M</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: '15px', color: TEXT }}>MechIQ</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/chat" className="btn-ghost" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Open Chat
          </Link>
          <button onClick={handleSignOut} style={{
            background: 'transparent', border: 'none', color: MUTED, cursor: 'pointer', fontSize: '13px', padding: '8px',
          }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px', flexWrap: 'wrap' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${AMBER}, #d97706)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 900, color: '#000', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: TEXT, letterSpacing: '-0.02em', marginBottom: '2px' }}>
              Your Dashboard
            </h1>
            <p style={{ fontSize: '13px', color: MUTED }}>{user?.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '32px' }}>
          {/* Subscription card */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: '8px' }}>
              Plan
            </p>
            <p style={{ fontSize: '22px', fontWeight: 900, color: isPaid ? AMBER : TEXT, letterSpacing: '-0.02em' }}>
              {TIER_LABELS[tier] ?? tier}
            </p>
            <p style={{ fontSize: '12px', color: MUTED, marginTop: '3px' }}>{TIER_PRICES[tier] ?? '—'}</p>
          </div>

          {/* Daily usage card */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: '8px' }}>
              Queries today
            </p>
            <p style={{ fontSize: '22px', fontWeight: 900, color: TEXT, letterSpacing: '-0.02em' }}>
              {usedToday}<span style={{ fontSize: '14px', color: MUTED, fontWeight: 500 }}>/{dailyLimit}</span>
            </p>
            <div style={{ marginTop: '8px', height: '4px', borderRadius: '2px', background: BORDER }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                width: `${usagePct}%`,
                background: usagePct >= 90 ? '#ef4444' : usagePct >= 70 ? '#f59e0b' : '#22c55e',
                transition: 'width 0.3s',
              }} />
            </div>
          </div>

          {/* Sessions card */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: '8px' }}>
              Sessions
            </p>
            <p style={{ fontSize: '22px', fontWeight: 900, color: TEXT, letterSpacing: '-0.02em' }}>
              {sessions.length}
            </p>
            <p style={{ fontSize: '12px', color: MUTED, marginTop: '3px' }}>saved conversations</p>
          </div>
        </div>

        {/* Upgrade banner for free users */}
        {!isPaid && (
          <div style={{
            background: `linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.04) 100%)`,
            border: `1px solid rgba(245,158,11,0.25)`,
            borderRadius: '12px', padding: '20px 24px', marginBottom: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>
                You're on the free plan — 5 queries/day
              </p>
              <p style={{ fontSize: '13px', color: MUTED }}>
                Upgrade to Individual (£15/mo) for 500 queries/day and full session history.
              </p>
            </div>
            <button
              onClick={() => handleUpgrade('individual')}
              disabled={upgrading}
              className="btn-amber"
              style={{ fontSize: '13px', padding: '10px 22px', whiteSpace: 'nowrap', opacity: upgrading ? 0.7 : 1 }}
            >
              {upgrading ? 'Redirecting...' : 'Upgrade to Individual →'}
            </button>
          </div>
        )}

        {/* Session history */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: TEXT, letterSpacing: '-0.01em' }}>
              Recent sessions
            </h2>
            <Link href="/chat" style={{ fontSize: '13px', color: AMBER, textDecoration: 'none', fontWeight: 600 }}>
              + New session
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div style={{
              background: SURFACE, border: `1px dashed ${BORDER}`,
              borderRadius: '12px', padding: '48px 24px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔧</p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>No sessions yet</p>
              <p style={{ fontSize: '13px', color: MUTED, marginBottom: '20px' }}>Start a conversation to get answers about the car on your ramp.</p>
              <Link href="/chat" className="btn-amber" style={{ fontSize: '13px', padding: '10px 24px' }}>
                Start chatting →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sessions.map(s => (
                <Link key={s.id} href={`/chat?session=${s.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: '10px', padding: '16px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '12px', cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = AMBER
                      ;(e.currentTarget as HTMLElement).style.background = SURFACE2
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = BORDER
                      ;(e.currentTarget as HTMLElement).style.background = SURFACE
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: SURFACE2, border: `1px solid ${BORDER}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', flexShrink: 0,
                      }}>
                        🚗
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: TEXT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.title || vehicleLabel(s)}
                        </p>
                        <p style={{ fontSize: '12px', color: MUTED, marginTop: '2px' }}>
                          {s.title ? vehicleLabel(s) + ' · ' : ''}{formatDate(s.updated_at)}
                        </p>
                      </div>
                    </div>
                    <span style={{ color: MUTED, fontSize: '18px', flexShrink: 0 }}>›</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Subscription management */}
        {isPaid && sub?.current_period_end && (
          <div style={{ marginTop: '28px', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>Subscription</p>
              <p style={{ fontSize: '13px', color: MUTED }}>
                {TIER_LABELS[tier]} plan · renews {new Date(sub.current_period_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/billing-portal', { method: 'POST' })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              }}
              style={{
                background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: '8px',
                color: MUTED, fontSize: '13px', fontWeight: 600, padding: '8px 18px',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = AMBER; (e.currentTarget as HTMLElement).style.color = AMBER }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.color = MUTED }}
            >
              Manage billing →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default function DashboardPageWrapper() {
  return (
    <Suspense>
      <DashboardPage />
    </Suspense>
  )
}
