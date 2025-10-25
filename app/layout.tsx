import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pantun Generator',
  description: 'Buat pantun indah dengan AI. Pilih mode acak, lanjutkan pantun, atau buat pantun sesuai suasana hati Anda.',
  keywords: 'pantun, puisi, melayu, indonesia, AI, generator',
  authors: [{ name: 'Pantun Generator' }],
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
  openGraph: {
    title: 'Pantun Generator',
    description: 'Buat pantun indah dengan AI. Pilih mode acak, lanjutkan pantun, atau buat pantun sesuai suasana hati Anda.',
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
