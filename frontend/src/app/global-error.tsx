'use client'

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          alignItems: 'center',
          background: '#f5f7fa',
          color: '#172b4d',
          display: 'flex',
          fontFamily: 'Inter, system-ui, sans-serif',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 24,
        }}
      >
        <main
          style={{
            background: 'white',
            border: '1px solid #e4e7ec',
            borderRadius: 14,
            boxShadow: '0 18px 44px rgba(16,24,40,.12)',
            maxWidth: 460,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: '#eaf5fc',
              borderRadius: 12,
              color: '#003087',
              display: 'grid',
              fontSize: 22,
              height: 48,
              margin: '0 auto 18px',
              placeItems: 'center',
              width: 48,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 22, margin: 0 }}>We could not load FairPay AI</h1>
          <p style={{ color: '#667085', fontSize: 13, lineHeight: 1.6, margin: '10px 0 22px' }}>
            Try loading this page again. Your account and payment information are safe.
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              background: '#003087',
              border: 0,
              borderRadius: 8,
              color: 'white',
              cursor: 'pointer',
              fontWeight: 700,
              minHeight: 40,
              padding: '0 18px',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
