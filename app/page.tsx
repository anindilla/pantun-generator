import { PantunGenerator } from './components/PantunGenerator'
import { Footer } from './components/Footer'
import { trackPageView } from '@/lib/analytics'

export default function Home() {
  // Track page view
  trackPageView('home')

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-4 pb-8 sm:pt-8 sm:pb-12">
        <PantunGenerator />
      </div>
      <Footer />
    </main>
  )
}
