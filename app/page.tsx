"use client"

import Link from 'next/link'

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
        {/* Grid overlay */}
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
            <Link href="#features" className="btn-ghost" style={{ fontSize: '1rem', padding: '15px 36px' }}>
              See How It Works
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
            { icon: '💬', title: 'Ask Anything, Mid-Job', desc: 'Type your question while your hands are dirty. Get clear, step-by-step guidance in seconds — no more flicking through manuals.' },
            { icon: '🚗', title: 'All Drivetrain Types', desc: 'Full coverage across petrol, diesel, mild hybrid, PHEV, and full BEV. MechIQ knows the difference and answers accordingly.' },
            { icon: '🔍', title: 'Fault Code Intelligence', desc: 'Not just definitions — cause probability rankings, live data to check, and what to rule out before condemning parts.' },
            { icon: '📱', title: 'Works on Any Mobile', desc: 'No app download. MechIQ runs in your mobile browser — fast and clean even in workshops with patchy Wi-Fi.' },
            { icon: '🇬🇧', title: 'UK-Focused', desc: 'UK MOT standards, DVSA requirements, right-hand drive specs, and UK-market vehicle variants. No irrelevant US specs.' },
            { icon: '⚡', title: 'EV & High-Voltage Safety', desc: "HV system procedures, battery management, isolation testing — with clear safety warnings before every relevant answer." },
          ].map(f => (
            <div key={f.title} style={{
              background: '#0d0f14', border: '1px solid #2a3040',
              borderRadius: '12px', padding: '32px 28px',
              transition: 'border-color 0.25s, transform 0.25s',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,158,11,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a3040'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', marginBottom: '20px',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px', color: '#e8eaf0' }}>{f.title}</h3>
              <p style={{ fontSize: '0.92rem', color: '#8892a4', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '90px 5%' }}>
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
              background: plan.popular ? 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, #161a22 100%)' : '#161a22',
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
              <ul style={{ listStyle: 'none', flex: 1, marginBottom: '32px' }}>
                <li style={{ fontSize: '0.88rem', color: '#f59e0b', fontWeight: 600, paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {plan.seats}
                </li>
                {plan.features.map(f => (
                  <li key={f} style={{
                    display: 'flex', gap: '10px', fontSize: '0.92rem',
                    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: '#8892a4',
                  }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {f}
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
      <footer style={{ background: '#080a0e', borderTop: '1px solid #2a3040', padding: '40px 5% 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>Mech<span style={{ color: '#e8eaf0' }}>IQ</span></span>
            <p style={{ color: '#8892a4', fontSize: '0.88rem', maxWidth: '260px', marginTop: '8px' }}>
              AI knowledge companion built for UK independent automotive mechanics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            {[
              { title: 'Product', links: [{ label: 'Try Free', href: '/chat' }, { label: 'Pricing', href: '/pricing' }, { label: 'Dashboard', href: '/dashboard' }] },
              { title: 'Account', links: [{ label: 'Sign Up', href: '/signup' }, { label: 'Log In', href: '/login' }] },
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
        <div style={{ borderTop: '1px solid #2a3040', paddingTop: '20px', color: '#8892a4', fontSize: '0.8rem' }}>
          © 2026 MechIQ. All rights reserved.
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  )
}
