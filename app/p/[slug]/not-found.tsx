import Link from 'next/link'
import { Button } from '../../components/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-4 pb-20 sm:pt-8 sm:pb-24">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-4 text-center">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="hero-title mb-4">
              Pantun Generator
            </h1>
            <p className="hero-subtitle">
              Pantun tidak ditemukan
            </p>
          </div>

          {/* Error Message */}
          <div className="modern-card p-6 sm:p-8 text-center mb-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Pantun Tidak Ditemukan
              </h2>
              <p className="text-gray-600 mb-4">
                Pantun yang Anda cari tidak ditemukan atau mungkin sudah dihapus.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/">
              <Button size="lg" className="min-w-[200px] sm:min-w-[240px]">
                Buat Pantun Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
