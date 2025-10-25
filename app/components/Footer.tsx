import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 sm:py-8 px-4 text-center bg-white/95 backdrop-blur-sm border-t border-gray-200">
      <p className="text-sm sm:text-base text-gray-600 font-medium">
        Vibe-coded by{' '}
        <a 
          href="https://anindilla.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-blue-600 font-semibold transition-all duration-300 hover:underline decoration-2 underline-offset-4 decoration-blue-500"
        >
          dilleuh
        </a>
      </p>
    </footer>
  )
}
