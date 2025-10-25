import React from 'react'
import { Card } from './Card'
import { Button } from './Button'

interface ModeSelectorProps {
  selectedMode: string | null
  onModeSelect: (mode: string) => void
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onModeSelect
}) => {
  const modes = [
    {
      id: 'random',
      title: 'Acak',
      description: 'Buat pantun dengan tema acak yang menarik',
      icon: '🎲'
    },
    {
      id: 'continue',
      title: 'Lanjutkan',
      description: 'Lanjutkan pantun dari baris yang sudah Anda tulis',
      icon: '✍️'
    },
    {
      id: 'mood',
      title: 'Suasana Hati',
      description: 'Buat pantun sesuai suasana hati Anda',
      icon: '💭'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {modes.map((mode) => (
        <div
          key={mode.id}
          className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
          onClick={() => onModeSelect(mode.id)}
        >
          <div className="p-4 sm:p-6 text-center relative z-10">
            <div className="mode-icon text-3xl sm:text-4xl mb-4">
              {mode.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              {mode.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
              {mode.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
