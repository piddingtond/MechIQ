import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — MechIQ' }

const prose: React.CSSProperties = {
  color: '#8892a4', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '20px',
}
const h2style: React.CSSProperties = {
  color: '#e8eaf0', fontWeight: 700, fontSize: '1.15rem',
  marginTop: '36px', marginBottom: '10px',
}

export default function PrivacyPage() {
  return (
    <div style={{ background: '#0d0f14', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: '64px',
        background: 'rgba(13,15,20,0.92)', borderBottom: '1px solid #2a3040',
      }}>
        <Link href="/" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#f59e0b', textDecoration: 'none' }}>
          Mech<span style={{ color: '#e8eaf0' }}>IQ</span>
        </Link>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 5% 80px' }}>
        <h1 style={{ color: '#e8eaf0', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.8px', marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#4a5568', fontSize: '0.85rem', marginBottom: '40px' }}>
          Last updated: 11 May 2026 · Operated by Athena Ventures Ltd, United Kingdom
        </p>

        <p style={prose}>
          MechIQ is operated by Athena Ventures Ltd ("we", "us", "our"). This policy explains what personal data we collect, how we use it, and your rights under UK GDPR and the Data Protection Act 2018.
        </p>

        <h2 style={h2style}>1. Data we collect</h2>
        <p style={prose}>
          <strong style={{ color: '#e8eaf0' }}>Account data:</strong> name, email address, and garage name when you register.<br />
          <strong style={{ color: '#e8eaf0' }}>Usage data:</strong> chat messages, vehicle context you enter, session metadata, and query counts used to enforce plan limits.<br />
          <strong style={{ color: '#e8eaf0' }}>Billing data:</strong> Stripe handles card details — we never store card numbers. We hold your Stripe customer ID and subscription status.<br />
          <strong style={{ color: '#e8eaf0' }}>Technical data:</strong> IP address, browser type, and access logs for security and abuse prevention.
        </p>

        <h2 style={h2style}>2. How we use your data</h2>
        <p style={prose}>
          To provide and improve the MechIQ service; to manage your subscription and billing; to enforce fair usage limits; to send transactional emails (account confirmation, payment receipts). We do not sell your data or use it for advertising.
        </p>

        <h2 style={h2style}>3. Data sharing</h2>
        <p style={prose}>
          We share data only with the following processors: Supabase (database hosting, EU region); Stripe (payment processing); Anthropic (AI responses — your chat content is sent to Anthropic's API subject to their data processing agreement). We do not share data with other third parties.
        </p>

        <h2 style={h2style}>4. Data retention</h2>
        <p style={prose}>
          Account data is retained for the duration of your subscription plus 12 months. Chat history is retained for 12 months from creation. You may request deletion at any time (see Section 6).
        </p>

        <h2 style={h2style}>5. Cookies</h2>
        <p style={prose}>
          We use only essential session cookies required for authentication. We do not use tracking or advertising cookies.
        </p>

        <h2 style={h2style}>6. Your rights</h2>
        <p style={prose}>
          Under UK GDPR you have the right to access, correct, or delete your personal data; to restrict or object to processing; and to data portability. To exercise these rights, email <a href="mailto:hello@mechiq.co.uk" style={{ color: '#f59e0b' }}>hello@mechiq.co.uk</a>.
        </p>

        <h2 style={h2style}>7. Contact</h2>
        <p style={prose}>
          Athena Ventures Ltd · <a href="mailto:hello@mechiq.co.uk" style={{ color: '#f59e0b' }}>hello@mechiq.co.uk</a>
        </p>

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #2a3040' }}>
          <Link href="/" style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to MechIQ</Link>
          <span style={{ color: '#2a3040', margin: '0 12px' }}>·</span>
          <Link href="/terms" style={{ color: '#8892a4', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}
