import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const baseClasses = 'rounded-lg'
  
  const variantClasses = {
    default: 'kampung-card',
    elevated: 'bg-white/95 backdrop-blur-sm border-2 border-kampung-brown/30 rounded-lg shadow-xl',
    outlined: 'bg-white/80 backdrop-blur-sm border-2 border-kampung-brown/40 rounded-lg shadow-md'
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}
