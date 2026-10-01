import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size]

  const textStyles = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-semibold',
    lg: 'text-xl font-bold',
  }[size]

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Markdeck Vector Icon */}
      <div className={`relative ${iconDimensions} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="markdeck-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0071e3" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
          {/* Deck Canvas */}
          <rect width="40" height="32" y="3" rx="7" fill="url(#markdeck-brand-grad)" />
          {/* Slide Layout Marks */}
          <rect x="7" y="9" width="10" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.85" />
          <rect x="7" y="15" width="26" height="3" rx="1.5" fill="#ffffff" />
          <rect x="7" y="21" width="18" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.7" />
          <rect x="7" y="26" width="22" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.55" />
          {/* Base Stand */}
          <path d="M16 35 L14 39 L26 39 L24 35 Z" fill="#0071e3" fillOpacity="0.8" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <span
          className={`tracking-tight font-display text-[var(--color-text-primary)] leading-tight ${textStyles}`}
        >
          Mark<span className="text-[var(--color-accent)]">deck</span>
        </span>
      )}
    </div>
  )
}
