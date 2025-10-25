import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { FiCopy, FiCheck, FiRefreshCw, FiShare2 } from 'react-icons/fi'
import { trackPantunCopied, trackPantunShared } from '@/lib/analytics'

interface PantunDisplayProps {
  pantun: string
  onGenerateNew: () => void
  isLoading?: boolean
  mode?: string | null
  shareUrl?: string
}

export const PantunDisplay: React.FC<PantunDisplayProps> = ({
  pantun,
  onGenerateNew,
  isLoading = false,
  mode = 'unknown',
  shareUrl
}) => {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const handleCopy = async () => {
    try {
      const textWithAttribution = `${pantun}\n\nMade with pantun-generator.vercel.app by dilleuh`
      await navigator.clipboard.writeText(textWithAttribution)
      setCopied(true)
      trackPantunCopied(mode || 'unknown')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share && shareUrl) {
        await navigator.share({
          title: 'Pantun Generator',
          text: pantun,
          url: shareUrl
        })
        trackPantunShared(mode || 'unknown', 'native_share')
      } else if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl)
        trackPantunShared(mode || 'unknown', 'copy_link')
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch (err) {
      console.error('Failed to share: ', err)
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
    <div className="modern-card p-6 sm:p-8 text-center">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Pantun Anda
        </h3>
        <div className="pantun-display">
          {formatPantun(pantun)}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
        <Button
          onClick={handleCopy}
          variant="secondary"
          size="sm"
          className="flex items-center justify-center gap-2 min-w-[100px] sm:min-w-[120px]"
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

        {shareUrl && (
          <Button
            onClick={handleShare}
            variant="secondary"
            size="sm"
            className="flex items-center justify-center gap-2 min-w-[100px] sm:min-w-[120px]"
          >
            {shared ? (
              <>
                <FiCheck className="w-4 h-4" />
                Link Tersalin!
              </>
            ) : (
              <>
                <FiShare2 className="w-4 h-4" />
                Bagikan
              </>
            )}
          </Button>
        )}
        
        <Button
          onClick={onGenerateNew}
          variant="accent"
          size="sm"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 min-w-[100px] sm:min-w-[120px]"
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
