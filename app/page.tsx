"use client"

import Link from 'next/link'

/* ── Inline SVG line icons ── */
const Icon = ({ d, size = 28 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ICONS = {
  chat:    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  car:     "M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2m-8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0",
  search:  "M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm11 11-5.5-5.5M10 2v4M2 10h4",
  mobile:  "M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z",
  flag:    "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  bolt:    "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
}

/* ── Chat mockup data ── */
const CHAT_DEMO = [
  {
    role: 'user',
    text: 'P0420 on a 2019 Vauxhall Astra 1.4T petrol. Cleared it twice — comes back after about 40 miles.',
  },
  {
    role: 'ai',
    text: `P0420 means catalyst efficiency below threshold on Bank 1. On the 1.4T B14NET this is common — here's how to work it:

**Rule out cheap causes first:**
• Check for exhaust leaks upstream of the front O2 sensor — even a small one skews the reading
• Pull live O2 data: rear sensor should flatline between 0.6–0.8V at cruise. If it's cycling with the front sensor, the cat is done
• Check coolant temp reaches 90°C — a lazy thermostat keeps the cat below light-off temp and causes false P0420

**On this engine specifically:**
The B14NET runs lean under light throttle to improve economy. If injector data shows any cylinder running rich at idle, that's excess fuel killing the cat.

**Before condemning the cat:**
A £12 lambda sensor bung cap to block the rear sensor signal is worth ruling out sensor fault vs actual cat failure. If the code doesn't return, you have a duff rear sensor, not a £300 cat.

What does your live rear O2 data show at 2000rpm steady cruise?`,
  },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0f14', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: '64px',
        background: 'rgba(13,15,20,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a3040',
      }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#f59e0b' }}>
          Mech<span style={{ color: '#e8eaf0' }}>IQ</span>
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/chat" style={{ color: '#8892a4', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
            Try it free
          </Link>
          <Link href="/signup" className="btn-amber" style={{ padding: '10px 22px', fontSize: '14px' }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 5%',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%),
          linear-gradient(180deg, #0d0f14 0%, #10131a 100%)
        `,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', maxWidth: '820px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
            color: '#f59e0b', borderRadius: '999px',
            padding: '6px 16px', fontSize: '0.82rem', fontWeight: 600,
            marginBottom: '28px', letterSpacing: '0.4px',
          }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#f59e0b', display: 'inline-block',
              animation: 'pulse 2s infinite',
            }} />
            Now in early access — UK mechanics only
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900,
            lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: '24px', color: '#e8eaf0',
          }}>
            The AI Knowledge Companion<br />for{' '}
            <span style={{
              background: 'linear-gradient(90deg, #f59e0b, #fb923c)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Independent Mechanics
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: '#8892a4',
            maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6,
          }}>
            The automotive industry is shifting faster than ever. Stay ahead of the EV transition, hybrid systems, and modern diagnostics — with instant, trusted answers right when you need them on the ramp.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/chat" className="btn-amber" style={{ fontSize: '1rem', padding: '15px 36px' }}>
              Try MechIQ Free →
            </Link>
            <Link href="#demo" className="btn-ghost" style={{ fontSize: '1rem', padding: '15px 36px' }}>
              See It In Action
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginTop: '64px' }}>
            {[
              { val: '10k+', label: 'Vehicle models covered' },
              { val: 'Weekly', label: 'Knowledge updates' },
              { val: '24/7', label: 'Available on mobile' },
              { val: 'EV ready', label: 'Hybrid, BEV & PHEV' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: '#8892a4', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '90px 5%', background: '#161a22' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '14px' }}>
            How MechIQ Helps
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.8px', color: '#e8eaf0' }}>
            Your Expert. In Your Pocket.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { iconKey: 'chat',   title: 'Ask Anything, Mid-Job',        desc: 'Type your question while your hands are dirty. Get clear, step-by-step guidance in seconds — no more flicking through manuals.' },
            { iconKey: 'car',    title: 'All Drivetrain Types',          desc: 'Full coverage across petrol, diesel, mild hybrid, PHEV, and full BEV. MechIQ knows the difference and answers accordingly.' },
            { iconKey: 'search', title: 'Fault Code Intelligence',       desc: 'Not just definitions — cause probability rankings, live data to check, and what to rule out before condemning parts.' },
            { iconKey: 'mobile', title: 'Works on Any Mobile',           desc: 'No app download. MechIQ runs in your mobile browser — fast and clean even in workshops with patchy Wi-Fi.' },
            { iconKey: 'flag',   title: 'UK-Focused',                    desc: 'UK MOT standards, DVSA requirements, right-hand drive specs, and UK-market vehicle variants. No irrelevant US specs.' },
            { iconKey: 'bolt',   title: 'EV & High-Voltage Safety',      desc: 'HV system procedures, battery management, isolation testing — with clear safety warnings before every relevant answer.' },
          ].map(f => (
            <div key={f.title} style={{
              background: '#0d0f14', border: '1px solid #2a3040',
              borderRadius: '12px', padding: '32px 28px',
              transition: 'border-color 0.25s, transform 0.25s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a3040'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#f59e0b', marginBottom: '20px',
              }}>
                <Icon d={ICONS[f.iconKey as keyof typeof ICONS]} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', color: '#e8eaf0' }}>{f.title}</h3>
              <p style={{ fontSize: '0.92rem', color: '#8892a4', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Demo */}
      <section id="demo" style={{ padding: '90px 5%', background: '#0d0f14' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '14px' }}>
              See It In Action
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.8px', color: '#e8eaf0' }}>
              A real fault. A real answer.
            </h2>
            <p style={{ color: '#8892a4', marginTop: '12px', fontSize: '0.95rem' }}>
              This is the kind of response MechIQ gives — not a definition, a diagnostic path.
            </p>
          </div>

          {/* Chat window */}
          <div style={{
            background: '#161a22', border: '1px solid #2a3040',
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}>
            {/* Window chrome */}
            <div style={{
              background: '#1c2030', borderBottom: '1px solid #2a3040',
              padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => (
                  <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', color: '#8892a4', fontWeight: 500 }}>
                MechIQ — Chat Session
              </div>
            </div>

            {/* Vehicle context bar */}
            <div style={{
              background: 'rgba(245,158,11,0.06)', borderBottom: '1px solid rgba(245,158,11,0.15)',
              padding: '10px 24px', fontSize: '0.8rem', color: '#f59e0b',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Icon d={ICONS.car} size={14} />
              <span style={{ fontWeight: 600 }}>2019 Vauxhall Astra · 1.4T Petrol · B14NET · 68k miles</span>
            </div>

            {/* Messages */}
            <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {CHAT_DEMO.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  gap: '12px', alignItems: 'flex-start',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: msg.role === 'user' ? '#2a3040' : 'rgba(245,158,11,0.15)',
                    border: msg.role === 'ai' ? '1px solid rgba(245,158,11,0.3)' : 'none',
                    fontSize: '0.7rem', fontWeight: 700,
                    color: msg.role === 'user' ? '#8892a4' : '#f59e0b',
                  }}>
                    {msg.role === 'user' ? 'ME' : 'IQ'}
                  </div>

                  <div style={{
                    maxWidth: '85%',
                    background: msg.role === 'user' ? '#1c2030' : 'rgba(245,158,11,0.05)',
                    border: `1px solid ${msg.role === 'user' ? '#2a3040' : 'rgba(245,158,11,0.2)'}`,
                    borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    padding: '14px 18px',
                    fontSize: '0.9rem', lineHeight: 1.65, color: '#c8d0dc',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                      part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j} style={{ color: '#e8eaf0' }}>{part.slice(2, -2)}</strong>
                        : part
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                  fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b',
                }}>IQ</div>
                <div style={{
                  background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '4px 18px 18px 18px', padding: '14px 18px',
                  display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b',
                      display: 'inline-block', animation: `bounce 1.2s ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div style={{
              borderTop: '1px solid #2a3040', padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: '12px',
              background: '#1c2030',
            }}>
              <div style={{
                flex: 1, background: '#0d0f14', border: '1px solid #2a3040',
                borderRadius: '10px', padding: '10px 16px',
                fontSize: '0.88rem', color: '#4a5568',
              }}>
                What does the rear O2 waveform look like at cruise?
              </div>
              <div style={{
                width: '38px', height: '38px', borderRadius: '9px',
                background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000', cursor: 'pointer', flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/chat" className="btn-amber" style={{ fontSize: '0.95rem', padding: '13px 32px' }}>
              Try a question yourself — it's free →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '90px 5%', background: '#161a22' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '14px' }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.8px', color: '#e8eaf0' }}>Simple, Transparent Plans</h2>
          <p style={{ color: '#8892a4', marginTop: '12px' }}>Try free with no credit card. Upgrade when you're ready.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
          {[
            { id: 'individual', tier: 'Individual', price: '15', desc: 'Solo trader or mobile mechanic.', seats: '1 user', features: ['Unlimited AI questions', 'All vehicle types', 'Weekly knowledge updates', 'Mobile-optimised', 'UK MOT & DVSA aligned'], popular: false },
            { id: 'team', tier: 'Garage Team', price: '35', desc: 'Small garage with 2–5 mechanics.', seats: 'Up to 5 users', features: ['Everything in Individual', 'Shared job history', 'Team knowledge feed', 'Priority support', 'Early feature access'], popular: true },
            { id: 'multi_bay', tier: 'Multi-Bay', price: '75', desc: 'Established garage, multiple bays.', seats: 'Unlimited users', features: ['Everything in Team', 'Admin dashboard', 'Custom knowledge uploads', 'Dedicated account manager', 'API access (coming soon)'], popular: false },
          ].map(plan => (
            <div key={plan.tier} style={{
              background: plan.popular ? 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, #161a22 100%)' : '#0d0f14',
              border: `1px solid ${plan.popular ? '#f59e0b' : '#2a3040'}`,
              borderRadius: '12px', padding: '36px 28px',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              transform: plan.popular ? 'scale(1.03)' : 'none',
              boxShadow: plan.popular ? '0 0 60px rgba(245,158,11,0.12)' : 'none',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: '#f59e0b', color: '#000',
                  fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
                  padding: '5px 16px', borderRadius: '999px',
                }}>
                  Most Popular
                </div>
              )}
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
                {plan.tier}
              </p>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1px', color: '#e8eaf0' }}>
                <sup style={{ fontSize: '1.3rem', verticalAlign: 'super', marginRight: '2px' }}>£</sup>
                {plan.price}
                <sub style={{ fontSize: '0.9rem', color: '#8892a4', fontWeight: 400 }}>/mo</sub>
              </div>
              <p style={{ color: '#8892a4', fontSize: '0.88rem', margin: '10px 0 28px' }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', flex: 1, marginBottom: '32px', padding: 0 }}>
                <li style={{ fontSize: '0.88rem', color: '#f59e0b', fontWeight: 600, paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {plan.seats}
                </li>
                {plan.features.map(f => (
                  <li key={f} style={{
                    display: 'flex', gap: '10px', fontSize: '0.92rem',
                    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: '#8892a4',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/signup?plan=${plan.id}`}
                className={plan.popular ? 'btn-amber' : 'btn-ghost'}
                style={{ textAlign: 'center', fontSize: '0.95rem' }}
              >
                Get started →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#080a0e', borderTop: '1px solid #2a3040', padding: '48px 5% 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '40px', maxWidth: '1100px', margin: '0 auto 40px' }}>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>Mech<span style={{ color: '#e8eaf0' }}>IQ</span></span>
            <p style={{ color: '#8892a4', fontSize: '0.88rem', maxWidth: '260px', marginTop: '8px', lineHeight: 1.6 }}>
              AI knowledge companion built for UK independent automotive mechanics.
            </p>
            <p style={{ color: '#4a5568', fontSize: '0.8rem', marginTop: '12px' }}>
              Operated by Athena Ventures Ltd · United Kingdom
            </p>
          </div>
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {[
              { title: 'Product', links: [
                { label: 'Try Free', href: '/chat' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Dashboard', href: '/dashboard' },
              ]},
              { title: 'Account', links: [
                { label: 'Sign Up', href: '/signup' },
                { label: 'Log In', href: '/login' },
              ]},
              { title: 'Legal', links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: 'mailto:hello@mechiq.co.uk' },
              ]},
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>{col.title}</p>
                {col.links.map(l => (
                  <Link key={l.href} href={l.href} style={{ display: 'block', color: '#8892a4', fontSize: '0.88rem', textDecoration: 'none', marginBottom: '8px' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2a3040', paddingTop: '20px', color: '#4a5568', fontSize: '0.78rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span>© 2026 Athena Ventures Ltd. All rights reserved.</span>
          <span>
            <Link href="/privacy" style={{ color: '#4a5568', textDecoration: 'none', marginRight: '16px' }}>Privacy</Link>
            <Link href="/terms" style={{ color: '#4a5568', textDecoration: 'none' }}>Terms</Link>
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-5px); } }
      `}</style>
    </div>
  )
}
