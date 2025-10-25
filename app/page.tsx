import { PantunGenerator } from './components/PantunGenerator'
import { Footer } from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-start justify-center pt-4 pb-20 sm:pt-8 sm:pb-24">
        <PantunGenerator />
      </div>
      <Footer />
    </main>
  )
}
