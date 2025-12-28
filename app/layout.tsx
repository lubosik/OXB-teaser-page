import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import dynamic from 'next/dynamic'

const VapiWidget = dynamic(() => import('@/components/VapiWidget'), {
  ssr: false,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://oxbstudio.com'),
  title: {
    template: '%s | OXB Studio',
    default: 'OXB Studio - Build Your Vision with Expert Builders',
  },
  description: 'OXB Studio connects business owners with a curated network of professional developers, designers, and experts to bring your projects to life. Book a consultation to get matched with expert builders.',
  keywords: [
    'software development',
    'custom software',
    'SaaS development',
    'AI agents',
    'automation',
    'web development',
    'expert builders',
    'business software',
    'custom development',
  ],
  authors: [{ name: 'OXB Studio' }],
  creator: 'OXB Studio',
  publisher: 'OXB Studio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'OXB Studio - Build Your Vision with Expert Builders',
    description: 'OXB Studio connects business owners with a curated network of professional developers, designers, and experts to bring your projects to life.',
    siteName: 'OXB Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OXB Studio - Build Your Vision with Expert Builders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OXB Studio - Build Your Vision with Expert Builders',
    description: 'OXB Studio connects business owners with a curated network of professional developers, designers, and experts.',
    images: ['/og-image.jpg'],
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
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <StructuredData />
      </head>
      <body>
        {children}
        <VapiWidget />
      </body>
    </html>
  )
}

