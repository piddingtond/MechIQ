'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

type UserRow = {
  id: string
  email: string
  full_name: string | null
  garage_name: string | null
  role: string
  created_at: string
  subscription?: {
    tier: string
    status: string
    current_period_end: string | null
  } | null
  session_count?: number
  query_today?: number
}

const TIER_COLOR: Record<string, string> = {
  free: '#555570',
  individual: '#06B6D4',
  team: '#7C3AED',
  multi_bay: '#F59E0B',
}

const STATUS_COLOR: Record<string, string> = {
  active: '#10B981',
  canceled: '#EF4444',
  past_due: '#F59E0B',
  trialing: '#06B6D4',
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalUsers: 0, paidUsers: 0, totalSessions: 0, todayQueries: 0 })
  const [tab, setTab] = useState<'users' | 'sessions'>('users')
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    checkAdminAndLoad()
  }, [])

  async function checkAdminAndLoad() {
    let { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      try {
        const key = `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]}-auth-token`
        const raw = localStorage.getItem(key)
        if (raw) session = JSON.parse(raw)
      } catch { /* ignore */ }
    }
    if (!session) { router.push('/login'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') { router.push('/dashboard'); return }

    await Promise.all([loadUsers(), loadSessions()])
    setLoading(false)
  }

  async function loadUsers() {
    const today = new Date().toISOString().split('T')[0]

    const { data: profiles } = await supabase
      .from('profiles')
      .select(`
        id, email, full_name, garage_name, role, created_at,
        subscriptions(tier, status, current_period_end)
      `)
      .order('created_at', { ascending: false })

    const { data: sessionCounts } = await supabase
      .from('chat_sessions')
      .select('user_id')

    const { data: todayUsage } = await supabase
      .from('query_usage')
      .select('user_id, count')
      .eq('date', today)

    const sessionMap: Record<string, number> = {}
    for (const s of sessionCounts ?? []) {
      sessionMap[s.user_id] = (sessionMap[s.user_id] ?? 0) + 1
    }

    const usageMap: Record<string, number> = {}
    for (const u of todayUsage ?? []) {
      usageMap[u.user_id] = u.count
    }

    const rows: UserRow[] = (profiles ?? []).map((p: any) => ({
      ...p,
      subscription: p.subscriptions?.[0] ?? null,
      session_count: sessionMap[p.id] ?? 0,
      query_today: usageMap[p.id] ?? 0,
    }))

    setUsers(rows)

    const paidCount = rows.filter(r => r.subscription && r.subscription.tier !== 'free' && r.subscription.status === 'active').length
    const totalSessions = Object.values(sessionMap).reduce((a, b) => a + b, 0)
    const todayTotal = Object.values(usageMap).reduce((a, b) => a + b, 0)

    setStats({
      totalUsers: rows.length,
      paidUsers: paidCount,
      totalSessions,
      todayQueries: todayTotal,
    })
  }

  async function loadSessions() {
    const { data } = await supabase
      .from('chat_sessions')
      .select('id, title, vehicle, created_at, updated_at, user_id, profiles(email, full_name)')
      .order('updated_at', { ascending: false })
      .limit(100)
    setSessions(data ?? [])
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d0f14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #1e2130', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f14', fontFamily: "'Inter', sans-serif" }}>

      {/* Top bar */}
      <div style={{
        background: '#111318', borderBottom: '1px solid #1e2130',
        padding: '0 24px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', textDecoration: 'none' }}>MechIQ</Link>
          <span style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', padding: '2px 8px', letterSpacing: '0.08em' }}>ADMIN</span>
        </div>
        <Link href="/dashboard" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>← Dashboard</Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' }}>

        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '28px', letterSpacing: '-0.02em' }}>
          Admin Console
        </h1>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Total users', value: stats.totalUsers },
            { label: 'Paid subscribers', value: stats.paidUsers, accent: '#f59e0b' },
            { label: 'Total sessions', value: stats.totalSessions },
            { label: "Today's queries", value: stats.todayQueries, accent: '#06B6D4' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#111318', border: '1px solid #1e2130',
              borderRadius: '12px', padding: '20px 22px',
            }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.accent ?? '#f8fafc', letterSpacing: '-0.02em' }}>
                {s.value.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
          {(['users', 'sessions'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
                background: tab === t ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: tab === t ? '#f59e0b' : '#6b7280',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Users table */}
        {tab === 'users' && (
          <div style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e2130' }}>
                  {['User', 'Plan', 'Status', 'Sessions', "Today's queries", 'Joined'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #1a1d26' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                        {u.full_name || u.garage_name || '—'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '999px',
                        color: TIER_COLOR[u.subscription?.tier ?? 'free'],
                        background: `${TIER_COLOR[u.subscription?.tier ?? 'free']}15`,
                        textTransform: 'capitalize',
                      }}>
                        {u.subscription?.tier ?? 'free'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {u.subscription ? (
                        <span style={{ fontSize: '12px', color: STATUS_COLOR[u.subscription.status] ?? '#6b7280', fontWeight: 600 }}>
                          {u.subscription.status}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#555570' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#9ca3af' }}>
                      {u.session_count}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#9ca3af' }}>
                      {u.query_today}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6b7280' }}>
                      {new Date(u.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Sessions table */}
        {tab === 'sessions' && (
          <div style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e2130' }}>
                  {['Title', 'Vehicle', 'User', 'Last active'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => {
                  const v = s.vehicle
                  const vehicleStr = v ? [v.year, v.make, v.model, v.engine].filter(Boolean).join(' ') : '—'
                  const profile = s.profiles as any
                  return (
                    <tr key={s.id} style={{ borderBottom: i < sessions.length - 1 ? '1px solid #1a1d26' : 'none' }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#f8fafc', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.title || 'Untitled session'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#9ca3af' }}>
                        {typeof v === 'string' ? v || '—' : vehicleStr || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6b7280' }}>
                        {profile?.full_name || profile?.email || s.user_id.slice(0, 8) + '…'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#6b7280' }}>
                        {new Date(s.updated_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                    </tr>
                  )
                })}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                      No sessions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}
