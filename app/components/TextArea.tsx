import React from 'react'

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  className?: string
  label?: string
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  disabled = false,
  className = '',
  label
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-black mb-1.5 sm:mb-2">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`input-field text-sm sm:text-base ${className}`}
      />
    </div>
  )
}
