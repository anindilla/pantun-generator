import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="sticky bottom-0 w-full py-6 sm:py-8 px-4 text-center bg-white/60 backdrop-blur-md border-t border-white/30">
      <p className="text-sm sm:text-base text-gray-600 font-medium">
        Vibe-coded by{' '}
        <a 
          href="https://anindilla.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-orange-600 font-semibold transition-all duration-300 hover:underline decoration-2 underline-offset-4 decoration-orange-500"
        >
          dilleuh
        </a>
      </p>
    </footer>
  )
}
