import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Button } from '../../components/Button'
import { trackSharePageView } from '@/lib/analytics'
import Link from 'next/link'

interface PantunPageProps {
  params: Promise<{ slug: string }>
}

async function getPantun(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/pantun/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.pantun
  } catch (error) {
    console.error('Error fetching pantun:', error)
    return null
  }
}

export async function generateMetadata({ params }: PantunPageProps): Promise<Metadata> {
  const { slug } = await params
  const pantun = await getPantun(slug)
  
  if (!pantun) {
    return {
      title: 'Pantun Tidak Ditemukan - Pantun Generator',
      description: 'Pantun yang Anda cari tidak ditemukan.'
    }
  }

  const preview = pantun.content.split('\n')[0] + '...'
  
  return {
    title: `Pantun: ${preview} - Pantun Generator`,
    description: `Baca pantun ini: ${pantun.content.replace(/\n/g, ' ')}`,
    openGraph: {
      title: `Pantun: ${preview}`,
      description: `Baca pantun ini: ${pantun.content.replace(/\n/g, ' ')}`,
      type: 'website',
      url: `https://pantun-generator.vercel.app/p/${slug}`,
      images: [
        {
          url: `https://pantun-generator.vercel.app/api/og?title=${encodeURIComponent(preview)}`,
          width: 1200,
          height: 630,
          alt: 'Pantun Generator'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Pantun: ${preview}`,
      description: `Baca pantun ini: ${pantun.content.replace(/\n/g, ' ')}`,
      images: [`https://pantun-generator.vercel.app/api/og?title=${encodeURIComponent(preview)}`]
    }
  }
}

export default async function PantunPage({ params }: PantunPageProps) {
  const { slug } = await params
  const pantun = await getPantun(slug)
  
  if (!pantun) {
    notFound()
  }

  // Track page view
  trackSharePageView(slug)

  const formatPantun = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className="mb-2 last:mb-0">
        {line}
      </div>
    ))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-4 pb-20 sm:pt-8 sm:pb-24">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="hero-title mb-4">
              Pantun Generator
            </h1>
            <p className="hero-subtitle">
              Pantun yang dibagikan
            </p>
          </div>

          {/* Pantun Display */}
          <div className="modern-card p-6 sm:p-8 text-center mb-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Pantun
              </h2>
              <div className="pantun-display">
                {formatPantun(pantun.content)}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              <p>Dibuat dengan mode: <span className="font-semibold capitalize">{pantun.mode}</span></p>
              <p>Dilihat {pantun.view_count} kali</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/">
              <Button size="lg" className="min-w-[200px] sm:min-w-[240px]">
                Buat Pantun Sendiri
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
