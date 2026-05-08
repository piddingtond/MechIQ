import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'MechIQ — AI Knowledge Companion for Independent Mechanics',
  description: 'The AI-powered assistant built specifically for UK independent automotive technicians. Ask anything about the car on your ramp.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#161a22',
              color: '#e8eaf0',
              border: '1px solid #2a3040',
            },
          }}
        />
      </body>
    </html>
  )
}
