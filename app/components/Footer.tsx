import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="sticky bottom-0 w-full py-4 sm:py-6 px-3 sm:px-4 text-center bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
      <p className="text-xs sm:text-sm text-gray-600 font-medium">
        Vibe-coded by{' '}
        <a 
          href="https://anindilla.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-black hover:text-gray-800 font-semibold transition-colors duration-200 underline decoration-2 underline-offset-2"
        >
          dilleuh
        </a>
      </p>
    </footer>
  )
}
