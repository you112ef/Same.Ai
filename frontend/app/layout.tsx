import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Same - Build fullstack web apps by prompting',
  description: 'Make anything. Build fullstack web apps by prompting.',
  keywords: ['AI', 'web development', 'fullstack', 'prompting', 'Claude', 'same'],
  authors: [{ name: 'Same.Ai Team' }],
  creator: 'Same.Ai',
  publisher: 'Same.Ai',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://same-ai.com',
    title: 'Same.Ai - منصة الذكاء الاصطناعي الموحدة',
    description: 'تفاعل مع نماذج الذكاء الاصطناعي المتعددة في مكان واحد',
    siteName: 'Same.Ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Same.Ai - منصة الذكاء الاصطناعي الموحدة',
    description: 'تفاعل مع نماذج الذكاء الاصطناعي المتعددة في مكان واحد',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
