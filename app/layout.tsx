import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Generator Pantun - Buat Pantun Kreatif dengan AI',
  description: 'Buat pantun indah dengan AI. Pilih mode acak, lanjutkan pantun, atau buat pantun sesuai suasana hati Anda.',
  keywords: 'pantun, puisi, melayu, indonesia, AI, generator',
  authors: [{ name: 'Pantun Generator' }],
  openGraph: {
    title: 'Generator Pantun - Buat Pantun Kreatif dengan AI',
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
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
