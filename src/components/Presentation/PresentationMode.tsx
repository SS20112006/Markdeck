import React, { useEffect, useRef } from 'react'
import type { SlideData } from '../../types/deck'
import { SlideView } from '../Slide/SlideView'
import { X, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react'
import { Logo } from '../Brand/Logo'
import confetti from 'canvas-confetti'

interface PresentationModeProps {
  slides: SlideData[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  slides,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const currentSlide = slides[currentIndex]

  // Stable references to prevent effect re-runs when callbacks or slide index change
  const onNextRef = useRef(onNext)
  onNextRef.current = onNext
  const onPrevRef = useRef(onPrev)
  onPrevRef.current = onPrev
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Auto-focus container on mount so keyboard events are immediately captured
  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  // Robust Native Fullscreen Management - Runs ONCE on mount, NEVER on slide changes!
  useEffect(() => {
    let didEnterFullscreen = false

    const requestFs = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
          didEnterFullscreen = true
        }
      } catch {
        // Browser policy may require a direct user gesture; graceful fallback to CSS fullscreen
      }
    }

    requestFs()

    const handleFullscreenChange = () => {
      // Only close if we had successfully entered fullscreen and user exited via browser escape
      if (didEnterFullscreen && !document.fullscreenElement) {
        onCloseRef.current()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      // Exit fullscreen only when the presentation component is actually unmounted
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  // Robust Keyboard Navigation with Capture Phase
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent background windows or inputs from capturing keys
      e.stopPropagation()

      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
      } else if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === ' ' ||
        e.key === 'PageDown' ||
        (e.key === 'Enter' && !e.metaKey && !e.ctrlKey)
      ) {
        e.preventDefault()
        onNextRef.current()
      } else if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'PageUp' ||
        e.key === 'Backspace'
      ) {
        e.preventDefault()
        onPrevRef.current()
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault()
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    }

    // Attach with capture: true to intercept keys reliably
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [])

  // Click on slide to advance: left 25% goes back, right 75% goes forward
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    if (clickX < rect.width * 0.25) {
      onPrevRef.current()
    } else {
      onNextRef.current()
    }
  }

  // Touch Swipe gestures for iPad/iPhone/Tablets
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        onNextRef.current()
      } else {
        onPrevRef.current()
      }
    }
    touchStartX.current = null
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center outline-none select-none cursor-default"
    >
      {/* Subtle Brand Watermark */}
      <div className="absolute top-5 left-6 z-10 opacity-30 hover:opacity-90 transition-opacity">
        <Logo size="sm" showText={true} />
      </div>

      {/* Interactive Slide Canvas with Click Zones */}
      <div
        onClick={handleCanvasClick}
        className="w-full h-full flex items-center justify-center cursor-pointer"
        title="Clique na direita para avançar, na esquerda para recuar"
      >
        <SlideView slide={currentSlide} isPresentationMode={true} />
      </div>

      {/* Floating Bottom Control Bar */}
      <nav
        aria-label="Controlos de Apresentação"
        onClick={(e) => e.stopPropagation()} // Prevent slide advance when clicking buttons
        className="absolute bottom-6 px-4 py-2 rounded-full hig-regular-material shadow-2xl flex items-center space-x-3 text-white z-20 cursor-default"
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          aria-label="Slide anterior"
          title="Slide anterior (←)"
          className="hig-touch-target p-2 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
        </button>

        <span className="text-xs font-semibold px-2 text-[var(--color-text-primary)] tabular-nums select-none">
          {currentIndex + 1} / {slides.length}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={currentIndex >= slides.length - 1}
          aria-label="Próximo slide"
          title="Próximo slide (→ ou Espaço)"
          className="hig-touch-target p-2 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-[var(--color-text-primary)]" />
        </button>

        <div className="h-4 w-px bg-white/20" />

        <button
          type="button"
          onClick={() => confetti({ particleCount: 90, spread: 60 })}
          aria-label="Lançar Confetti"
          title="Celebrar (C)"
          className="hig-touch-target p-2 rounded-full hover:bg-white/20 transition-colors text-amber-400"
        >
          <PartyPopper className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Sair da apresentação"
          title="Sair (Esc)"
          className="hig-touch-target p-2 rounded-full hover:bg-white/20 transition-colors text-red-400"
        >
          <X className="w-4 h-4" />
        </button>
      </nav>
    </div>
  )
}
