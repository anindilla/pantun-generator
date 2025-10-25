'use client'

import React, { useState } from 'react'
import { ModeSelector } from './ModeSelector'
import { PantunDisplay } from './PantunDisplay'
import { TextArea } from './TextArea'
import { Button } from './Button'
import { Card } from './Card'
import { trackModeSelected, trackPantunGenerated } from '@/lib/analytics'

type Mode = 'random' | 'continue' | 'mood'

interface PantunGeneratorProps {}

export const PantunGenerator: React.FC<PantunGeneratorProps> = () => {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
  const [input, setInput] = useState('')
  const [mood, setMood] = useState('')
  const [generatedPantun, setGeneratedPantun] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode as Mode)
    setInput('')
    setMood('')
    setGeneratedPantun('')
    setShareUrl('')
    setError('')
    trackModeSelected(mode)
  }

  const handleGenerate = async () => {
    if (!selectedMode) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate-pantun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: selectedMode,
          input: selectedMode === 'continue' ? input : undefined,
          mood: selectedMode === 'mood' ? mood : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan')
      }

      setGeneratedPantun(data.pantun)
      trackPantunGenerated(selectedMode, true)

      // Save pantun to database and get share URL
      try {
        const saveResponse = await fetch('/api/pantun/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: data.pantun,
            mode: selectedMode,
          }),
        })

        if (saveResponse.ok) {
          const saveData = await saveResponse.json()
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
          setShareUrl(`${baseUrl}/p/${saveData.slug}`)
        }
      } catch (saveError) {
        console.error('Failed to save pantun:', saveError)
        // Continue without share URL
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateNew = () => {
    setGeneratedPantun('')
    setShareUrl('')
    setError('')
  }

  const renderInputArea = () => {
    if (!selectedMode) return null

    switch (selectedMode) {
      case 'continue':
        return (
          <div className="modern-card p-3 sm:p-4">
            <TextArea
              label="Masukkan baris pantun yang sudah ada (1-3 baris):"
              value={input}
              onChange={setInput}
              placeholder="Contoh:&#10;Ikan lele minum bir&#10;Ikan hiu makan tomat"
              rows={3}
            />
          </div>
        )
      
      case 'mood':
        return (
          <div className="modern-card p-3 sm:p-4">
            <TextArea
              label="Ceritakan suasana hati Anda:"
              value={mood}
              onChange={setMood}
              placeholder="Contoh: Sedih karena kehilangan, bahagia karena berhasil, atau galau karena cinta..."
              rows={3}
            />
          </div>
        )
      
      case 'random':
        return (
          <div className="modern-card p-3 sm:p-4 text-center">
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Klik tombol "Buat Pantun" untuk menghasilkan pantun acak
            </p>
          </div>
        )
      
      default:
        return null
    }
  }

  const canGenerate = () => {
    switch (selectedMode) {
      case 'continue':
        return input.trim().length > 0
      case 'mood':
        return mood.trim().length > 0
      case 'random':
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 animate-fade-in">
        <h1 className="hero-title">
          Pantun Generator
        </h1>
        <p className="hero-subtitle">
          Mau bikin pantun apa hari ini?
        </p>
      </div>

      {/* Mode Selection */}
      <div className="animate-slide-up">
        <ModeSelector
          selectedMode={selectedMode}
          onModeSelect={handleModeSelect}
        />
      </div>

      {/* Input Area */}
      {selectedMode && (
        <div className="mb-6 sm:mb-8 animate-stagger">
          {renderInputArea()}
          
          <div className="flex justify-center mt-4 sm:mt-6">
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate() || isLoading}
              size="md"
              className="min-w-[200px] sm:min-w-[240px]"
            >
              {isLoading ? 'Membuat Pantun...' : 'Buat Pantun'}
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="modern-card p-3 sm:p-4 mb-3 sm:mb-4 bg-red-50 border-red-200">
          <p className="text-red-600 text-center font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {generatedPantun && (
        <div className="animate-bounce-gentle">
          <PantunDisplay
            pantun={generatedPantun}
            onGenerateNew={handleGenerateNew}
            isLoading={isLoading}
            mode={selectedMode}
            shareUrl={shareUrl}
          />
        </div>
      )}
    </div>
  )
}
