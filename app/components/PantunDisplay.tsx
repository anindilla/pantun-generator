import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi'

interface PantunDisplayProps {
  pantun: string
  onGenerateNew: () => void
  isLoading?: boolean
}

export const PantunDisplay: React.FC<PantunDisplayProps> = ({
  pantun,
  onGenerateNew,
  isLoading = false
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pantun)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatPantun = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className="mb-2 last:mb-0">
        {line}
      </div>
    ))
  }

  return (
    <div className="modern-card p-6 text-center">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-black mb-3">
          Pantun Anda
        </h3>
        <div className="pantun-display bg-gray-50 rounded-lg p-4 border border-gray-200">
          {formatPantun(pantun)}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleCopy}
          variant="secondary"
          className="flex items-center justify-center gap-2 min-w-[120px]"
        >
          {copied ? (
            <>
              <FiCheck className="w-4 h-4" />
              Tersalin!
            </>
          ) : (
            <>
              <FiCopy className="w-4 h-4" />
              Salin
            </>
          )}
        </Button>
        
        <Button
          onClick={onGenerateNew}
          variant="accent"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 min-w-[120px]"
        >
          {isLoading ? (
            <>
              <FiRefreshCw className="w-4 h-4 animate-spin" />
              Membuat...
            </>
          ) : (
            <>
              <FiRefreshCw className="w-4 h-4" />
              Buat Lagi
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
