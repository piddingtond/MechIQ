import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0d0f14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{
          fontSize: '72px', fontWeight: 900, letterSpacing: '-0.04em',
          color: '#f59e0b', marginBottom: '16px',
        }}>
          404
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#e8eaf0', marginBottom: '10px' }}>
          Page not found
        </h1>
        <p style={{ fontSize: '15px', color: '#8892a4', marginBottom: '36px', lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or has moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/chat" style={{
            background: '#f59e0b', color: '#000',
            padding: '11px 28px', borderRadius: '8px',
            fontWeight: 800, fontSize: '14px', textDecoration: 'none',
          }}>
            Open Chat
          </Link>
          <Link href="/" style={{
            background: '#161a22', border: '1px solid #2a3040',
            color: '#8892a4', padding: '11px 28px', borderRadius: '8px',
            fontWeight: 600, fontSize: '14px', textDecoration: 'none',
          }}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
