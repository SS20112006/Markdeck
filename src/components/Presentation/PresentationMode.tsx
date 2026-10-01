import React, { useEffect } from 'react'
import type { SlideData } from '../../types/deck'
import { SlideView } from '../Slide/SlideView'
import { X, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react'
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
  const currentSlide = slides[currentIndex]

  // Native Fullscreen API Integration
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      } catch {
        // Silently handle if browser restricts automatic fullscreen
      }
    }

    enterFullscreen()

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onClose()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [onClose])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        onNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrev()
      } else if (e.key.toLowerCase() === 'c') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Slide Canvas */}
      <SlideView slide={currentSlide} isPresentationMode={true} />

      {/* Floating Bottom Control Bar */}
      <nav
        aria-label="Controlos de Apresentação"
        className="absolute bottom-6 px-4 py-2 rounded-full hig-regular-material shadow-2xl flex items-center space-x-3 text-white"
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          aria-label="Slide anterior"
          className="hig-touch-target p-2 rounded-full hover:bg-white/20 disabled:opacity-30 transition-colors"
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
          className="hig-touch-target p-2 rounded-full hover:bg-white/20 disabled:opacity-30 transition-colors"
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
