export default function Loading() {
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
              Memuat pantun...
            </p>
          </div>

          {/* Loading Pantun Display */}
          <div className="modern-card p-6 sm:p-8 text-center mb-8">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Pantun
              </h2>
              <div className="pantun-display">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading CTA */}
          <div className="text-center">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto w-[200px] sm:w-[240px]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
