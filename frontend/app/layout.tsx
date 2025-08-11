import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo'
})

export const metadata: Metadata = {
  title: 'Same.Ai - منصة الذكاء الاصطناعي الموحدة',
  description: 'تفاعل مع نماذج الذكاء الاصطناعي المتعددة في مكان واحد - GPT، Claude، Gemini وأكثر',
  keywords: ['ذكاء اصطناعي', 'AI', 'GPT', 'Claude', 'Gemini', 'محادثة', 'Same.Ai'],
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
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}