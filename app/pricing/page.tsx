'use client'

import Link from 'next/link'

const TIERS = [
  {
    id: 'individual',
    label: 'Individual',
    price: '£15',
    period: '/mo',
    desc: 'For solo mechanics and independent technicians.',
    limit: '500 queries/day',
    features: [
      '500 queries per day',
      'Full session history',
      'Vehicle context memory',
      'Priority response',
      'All fault code coverage',
    ],
    highlight: false,
    cta: 'Start Individual',
  },
  {
    id: 'team',
    label: 'Garage Team',
    price: '£35',
    period: '/mo',
    desc: 'For garages with up to 5 technicians.',
    limit: '500 queries/day per user',
    features: [
      'Up to 5 users',
      '500 queries/day per user',
      'Shared vehicle context',
      'Team session dashboard',
      'All fault code coverage',
    ],
    highlight: true,
    cta: 'Start Garage Team',
  },
  {
    id: 'multi_bay',
    label: 'Multi-Bay',
    price: '£75',
    period: '/mo',
    desc: 'For multi-bay operations and franchise garages.',
    limit: 'Unlimited users',
    features: [
      'Unlimited users',
      '500 queries/day per user',
      'Admin dashboard',
      'Usage analytics',
      'Priority support',
    ],
    highlight: false,
    cta: 'Start Multi-Bay',
  },
]

const FAQ = [
  {
    q: 'Is there a free tier?',
    a: 'Yes. You can try MechIQ free with 5 queries per day — no credit card required. Upgrade when you need more.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. Cancel any time from your dashboard. Your access continues until the end of the billing period.',
  },
  {
    q: 'What vehicles does MechIQ cover?',
    a: 'All petrol, diesel, hybrid, and battery-electric vehicles sold in the UK market. Includes OBD-II fault codes, MOT standards, EV high-voltage procedures, and manufacturer TSBs.',
  },
  {
    q: 'Does MechIQ read live OBD data?',
    a: 'No. MechIQ is a knowledge tool, not a live diagnostic system. You feed it the fault codes and context; it gives you cause probabilities, data to check, and what to rule out.',
  },
  {
    q: 'Is the Garage Team plan per-garage or per-user?',
    a: 'Per-garage, up to 5 users. Each user gets 500 queries per day.',
  },
]

const BG = '#0d0f14'
const SURFACE = '#161a22'
const BORDER = '#2a3040'
const AMBER = '#f59e0b'
const MUTED = '#8892a4'
const TEXT = '#e8eaf0'

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: AMBER, letterSpacing: '-0.5px' }}>
            Mech<span style={{ color: TEXT }}>IQ</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" style={{ fontSize: '13px', color: MUTED, textDecoration: 'none', padding: '8px 16px' }}>Sign in</Link>
          <Link href="/signup" className="btn-amber" style={{ fontSize: '13px', padding: '8px 20px' }}>Get started</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: AMBER, marginBottom: '14px' }}>
            Pricing
          </p>
          <h1 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.03em', color: TEXT, lineHeight: 1.1, marginBottom: '16px' }}>
            Pay for what you use.
            <br />
            <span style={{ color: AMBER }}>Stop guessing on the ramp.</span>
          </h1>
          <p style={{ fontSize: '17px', color: MUTED, maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Start free with 5 queries a day. Upgrade when your garage needs more.
          </p>
        </div>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '64px' }}>
          {TIERS.map(tier => (
            <div key={tier.id} style={{
              background: tier.highlight
                ? `linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.04) 100%)`
                : SURFACE,
              border: `1px solid ${tier.highlight ? 'rgba(245,158,11,0.35)' : BORDER}`,
              borderRadius: '14px', padding: '32px',
              boxShadow: tier.highlight ? `0 0 40px rgba(245,158,11,0.1)` : 'none',
              position: 'relative',
            }}>
              {tier.highlight && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: AMBER, color: '#000', fontSize: '11px', fontWeight: 800,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '4px 14px', borderRadius: '999px',
                }}>
                  Most popular
                </div>
              )}
              <p style={{ fontSize: '13px', fontWeight: 700, color: tier.highlight ? AMBER : MUTED, marginBottom: '8px' }}>
                {tier.label}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '6px' }}>
                <span style={{ fontSize: '44px', fontWeight: 900, color: TEXT, letterSpacing: '-0.04em' }}>{tier.price}</span>
                <span style={{ fontSize: '16px', color: MUTED }}>{tier.period}</span>
              </div>
              <p style={{ fontSize: '12px', color: MUTED, marginBottom: '4px' }}>{tier.limit}</p>
              <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.6, marginBottom: '24px' }}>{tier.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                {tier.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: MUTED }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/signup?plan=${tier.id}`}
                className={tier.highlight ? 'btn-amber' : 'btn-ghost'}
                style={{ display: 'block', textAlign: 'center', fontSize: '14px', padding: '12px 24px' }}
              >
                {tier.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Free tier note */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: SURFACE, border: `1px solid ${BORDER}`,
            borderRadius: '999px', padding: '10px 20px', fontSize: '13px', color: MUTED,
          }}>
            <span style={{ color: '#22c55e' }}>✓</span>
            <span>5 free queries per day, no credit card required.</span>
            <Link href="/chat" style={{ color: AMBER, textDecoration: 'none', fontWeight: 700 }}>Try it now →</Link>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: TEXT, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQ.map(({ q, a }) => (
              <div key={q} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '20px 24px' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: TEXT, marginBottom: '6px' }}>{q}</p>
                <p style={{ fontSize: '13px', color: MUTED, lineHeight: 1.65 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
