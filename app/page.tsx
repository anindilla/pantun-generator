import { PantunGenerator } from './components/PantunGenerator'
import { Footer } from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <PantunGenerator />
      </div>
      <Footer />
    </main>
  )
}
