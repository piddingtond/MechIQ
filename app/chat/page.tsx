'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function renderInline(text: string): (string | JSX.Element)[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} style={{ color: '#e8eaf0', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} style={{ background: '#2a3040', padding: '1px 5px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', color: '#f59e0b' }}>{part.slice(1, -1)}</code>
    return part
  })
}

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const out: JSX.Element[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++ }
      out.push(<pre key={i} style={{ background: '#0d0f14', border: '1px solid #2a3040', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', fontFamily: 'monospace', color: '#e8eaf0', overflowX: 'auto', margin: '6px 0', whiteSpace: 'pre-wrap' }}>{code.join('\n')}</pre>)
    } else if (line.startsWith('### ')) {
      out.push(<p key={i} style={{ fontSize: '13px', fontWeight: 700, color: '#e8eaf0', margin: '10px 0 2px' }}>{renderInline(line.slice(4))}</p>)
    } else if (line.startsWith('## ')) {
      out.push(<p key={i} style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', margin: '12px 0 4px', letterSpacing: '-0.01em' }}>{renderInline(line.slice(3))}</p>)
    } else if (/^[-*] /.test(line)) {
      out.push(<p key={i} style={{ fontSize: '14px', lineHeight: 1.65, color: '#c8cad0', margin: '2px 0', paddingLeft: '12px' }}>· {renderInline(line.slice(2))}</p>)
    } else if (/^\d+\. /.test(line)) {
      const match = line.match(/^(\d+)\. (.*)/)!
      out.push(<p key={i} style={{ fontSize: '14px', lineHeight: 1.65, color: '#c8cad0', margin: '2px 0', paddingLeft: '12px' }}>{match[1]}. {renderInline(match[2])}</p>)
    } else if (line.trim() === '') {
      out.push(<div key={i} style={{ height: '6px' }} />)
    } else {
      out.push(<p key={i} style={{ fontSize: '14px', lineHeight: 1.7, color: '#e8eaf0', margin: '2px 0' }}>{renderInline(line)}</p>)
    }
    i++
  }
  return out
}

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type VehicleContext = {
  make: string
  model: string
  year: string
  engine?: string
}

const EXAMPLE_QUERIES = [
  "What's causing a P0299 on a 2019 Vauxhall Astra 1.4T?",
  "Safe to drive with a P0420 catalyst efficiency code?",
  "Torque specs for a Ford Focus 1.6 TDCI timing belt",
  "High-voltage precautions for a 2022 Nissan Leaf battery",
  "Difference between P0300 and P0301 misfire codes",
]

function ChatPageInner() {
  const searchParams = useSearchParams()
  const initialSessionId = searchParams.get('session')

  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSession, setLoadingSession] = useState(!!initialSessionId)
  const [vehicle, setVehicle] = useState<VehicleContext>({ make: '', model: '', year: '', engine: '' })
  const [showVehicle, setShowVehicle] = useState(false)
  const [queryCount, setQueryCount] = useState(0)
  const [isAuth, setIsAuth] = useState(false)
  const FREE_LIMIT = 5
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check auth and load session if provided
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuth(!!session?.user)

      if (initialSessionId && session?.user) {
        // Load existing messages from this session
        const { data: msgs } = await supabase
          .from('chat_messages')
          .select('role, content, created_at')
          .eq('session_id', initialSessionId)
          .order('created_at', { ascending: true })

        if (msgs && msgs.length > 0) {
          setMessages(msgs.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: new Date(m.created_at),
          })))
        } else {
          setMessages([{
            role: 'assistant',
            content: "Hello. I'm your MechIQ assistant — built for independent mechanics, not generic AI.\n\nTell me what you're working on. Set your vehicle context above if you want model-specific answers.",
            timestamp: new Date(),
          }])
        }

        // Load vehicle from session
        const { data: sess } = await supabase
          .from('chat_sessions')
          .select('vehicle')
          .eq('id', initialSessionId)
          .single()
        if (sess?.vehicle) setVehicle({ make: '', model: '', year: '', engine: '', ...sess.vehicle })
      } else {
        setMessages([{
          role: 'assistant',
          content: "Hello. I'm your MechIQ assistant — built for independent mechanics, not generic AI.\n\nTell me what you're working on. Set your vehicle context above if you want model-specific answers.",
          timestamp: new Date(),
        }])
      }

      setLoadingSession(false)
    }
    init()
  }, [initialSessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const vehicleSummary = vehicle.make
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.engine ? ` (${vehicle.engine})` : ''}`
    : null

  function getAccessToken(): string | null {
    try {
      const key = `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]}-auth-token`
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      return parsed?.access_token ?? null
    } catch { return null }
  }

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim()
    if (!userText || loading) return

    if (!isAuth && queryCount >= FREE_LIMIT) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "You've reached the free query limit. Create an account or upgrade to MechIQ to continue with unlimited questions.",
        timestamp: new Date(),
      }])
      return
    }

    const userMsg: Message = { role: 'user', content: userText, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    if (!isAuth) setQueryCount(n => n + 1)

    try {
      const allMessages = [...messages, userMsg]
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      const token = getAccessToken()
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          vehicle: vehicleSummary,
          sessionId,
        }),
      })

      if (res.status === 429) {
        const data = await res.json()
        if (data.limitReached) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "You've hit today's query limit. Upgrade your plan for more queries.",
            timestamp: new Date(),
          }])
          setLoading(false)
          return
        }
      }

      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()

      // Store returned sessionId for subsequent requests
      if (data.sessionId && !sessionId) setSessionId(data.sessionId)

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      }])
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showGate = !isAuth && queryCount >= FREE_LIMIT

  if (loadingSession) {
    return (
      <div style={{ minHeight: '100dvh', background: '#0d0f14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #2a3040', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#0d0f14' }}>

      {/* TOP BAR */}
      <header style={{
        background: 'rgba(13,15,20,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a3040',
        padding: '0 16px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.5px' }}>
            Mech<span style={{ color: '#e8eaf0' }}>IQ</span>
          </span>
        </Link>

        <button
          onClick={() => setShowVehicle(v => !v)}
          style={{
            background: vehicleSummary ? 'rgba(245,158,11,0.12)' : '#1e2330',
            border: `1px solid ${vehicleSummary ? '#f59e0b' : '#2a3040'}`,
            borderRadius: '8px', color: vehicleSummary ? '#f59e0b' : '#8892a4',
            padding: '6px 14px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          {vehicleSummary ? `🚗 ${vehicleSummary}` : '+ Set Vehicle'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isAuth && (
            <span style={{ fontSize: '12px', color: '#8892a4' }}>
              {queryCount}/{FREE_LIMIT} free
            </span>
          )}
          {isAuth ? (
            <Link href="/dashboard" style={{ fontSize: '13px', color: '#8892a4', textDecoration: 'none', fontWeight: 600 }}>
              Dashboard
            </Link>
          ) : (
            <Link href="/signup" className="btn-amber" style={{ padding: '6px 16px', fontSize: '13px' }}>
              Upgrade
            </Link>
          )}
        </div>
      </header>

      {/* VEHICLE CONTEXT PANEL */}
      {showVehicle && (
        <div style={{ background: '#161a22', borderBottom: '1px solid #2a3040', padding: '16px', flexShrink: 0 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Vehicle Context
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
            {[
              { key: 'make', label: 'Make', placeholder: 'e.g. Ford' },
              { key: 'model', label: 'Model', placeholder: 'e.g. Focus' },
              { key: 'year', label: 'Year', placeholder: 'e.g. 2020' },
              { key: 'engine', label: 'Engine', placeholder: 'e.g. 1.5T EcoBoost' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: '11px', color: '#8892a4', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{label}</label>
                <input
                  value={vehicle[key as keyof VehicleContext] || ''}
                  onChange={e => setVehicle(v => ({ ...v, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{
                    width: '100%', background: '#0d0f14', border: '1px solid #2a3040',
                    borderRadius: '6px', padding: '8px 10px', color: '#e8eaf0',
                    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowVehicle(false)}
            style={{
              marginTop: '12px', background: '#f59e0b', color: '#000',
              border: 'none', borderRadius: '6px', padding: '8px 20px',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Set Vehicle
          </button>
        </div>
      )}

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 1 && messages[0].role === 'assistant' && (
          <div style={{ marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', color: '#8892a4', marginBottom: '10px', fontWeight: 600 }}>TRY ASKING:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {EXAMPLE_QUERIES.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    background: '#1e2330', border: '1px solid #2a3040',
                    borderRadius: '8px', padding: '10px 14px',
                    color: '#8892a4', fontSize: '13px', textAlign: 'left',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f59e0b'; (e.currentTarget as HTMLElement).style.color = '#e8eaf0' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a3040'; (e.currentTarget as HTMLElement).style.color = '#8892a4' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user' ? '#2a3040' : 'rgba(245,158,11,0.15)',
              border: `1px solid ${msg.role === 'user' ? '#2a3040' : 'rgba(245,158,11,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>
              {msg.role === 'user' ? '👤' : '🔧'}
            </div>
            <div style={{
              maxWidth: '75%', minWidth: '60px',
              background: msg.role === 'user' ? '#1e2330' : '#161a22',
              border: `1px solid ${msg.role === 'user' ? '#2a3040' : 'rgba(245,158,11,0.15)'}`,
              borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
              padding: '12px 16px',
            }}>
              {msg.role === 'user' ? (
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#e8eaf0', whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</p>
              ) : (
                <div>{renderMarkdown(msg.content)}</div>
              )}
              <p style={{ fontSize: '11px', color: '#555570', marginTop: '6px' }}>
                {msg.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>🔧</div>
            <div style={{
              background: '#161a22', border: '1px solid rgba(245,158,11,0.15)',
              borderRadius: '4px 16px 16px 16px', padding: '14px 18px',
              display: 'flex', gap: '5px', alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b',
                  display: 'inline-block', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* UPGRADE GATE */}
      {showGate && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, #161a22 100%)',
          border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px',
          margin: '0 16px 12px', padding: '20px', textAlign: 'center', flexShrink: 0,
        }}>
          <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Free queries used up</p>
          <p style={{ fontSize: '13px', color: '#8892a4', marginBottom: '16px' }}>
            Upgrade for unlimited questions — £15/month for solo mechanics.
          </p>
          <Link href="/pricing" className="btn-amber" style={{ fontSize: '14px', padding: '10px 24px' }}>
            View Plans →
          </Link>
        </div>
      )}

      {/* INPUT BAR */}
      <div style={{ borderTop: '1px solid #2a3040', padding: '12px 16px', background: '#0d0f14', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: '10px', alignItems: 'flex-end',
          background: '#161a22', border: '1px solid #2a3040',
          borderRadius: '12px', padding: '10px 14px', transition: 'border-color 0.2s',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={showGate ? 'Upgrade to continue...' : 'Ask anything — fault codes, torque specs, EV systems...'}
            disabled={showGate}
            rows={1}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#e8eaf0', fontSize: '14px', fontFamily: 'inherit',
              resize: 'none', lineHeight: 1.6, maxHeight: '120px', overflow: 'auto',
            }}
            onInput={e => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading || showGate}
            style={{
              background: input.trim() && !loading && !showGate ? '#f59e0b' : '#2a3040',
              border: 'none', borderRadius: '8px', width: '36px', height: '36px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'default', transition: 'background 0.2s', fontSize: '16px',
            }}
          >↑</button>
        </div>
        <p style={{ fontSize: '11px', color: '#555570', textAlign: 'center', marginTop: '8px' }}>
          MechIQ can make mistakes. Verify critical torque specs from OEM data before work.
        </p>
      </div>

      <style>{`
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
      `}</style>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', background: '#0d0f14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #2a3040', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ChatPageInner />
    </Suspense>
  )
}
