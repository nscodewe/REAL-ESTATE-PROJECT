import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { CrmProvider } from '@/lib/crm-context'
import './globals.css'

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Real Estate CRM Dashboard',
  description: 'Manage leads, properties, clients, and deals efficiently',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-gray-50">
      <body className={`${geist.className} font-sans antialiased bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <CrmProvider>
            {children}
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </CrmProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
