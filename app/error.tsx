'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0f14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif", padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '48px', fontWeight: 900, color: '#ef4444', marginBottom: '16px' }}>
          Something went wrong
        </div>
        <p style={{ fontSize: '15px', color: '#8892a4', marginBottom: '36px', lineHeight: 1.6 }}>
          An unexpected error occurred. You can try again or head back.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              background: '#f59e0b', color: '#000',
              padding: '11px 28px', borderRadius: '8px',
              fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer',
            }}
          >
            Try again
          </button>
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
