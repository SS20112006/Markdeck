import React from 'react'
import { Play, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ToolbarProps {
  currentSlide: number
  totalSlides: number
  onPrev: () => void
  onNext: () => void
  onStartPresentation: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onStartPresentation,
}) => {
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    })
  }

  return (
    <header className="hig-regular-material h-14 px-4 flex items-center justify-between z-20 select-none">
      {/* Brand & Document Name */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xs shadow-sm">
          MD
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-tight text-[var(--color-text-primary)]">
            Markdeck
          </h1>
          <p className="text-[11px] text-[var(--color-text-secondary)]">Apresentação Markdown</p>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentSlide === 0}
          aria-label="Slide anterior"
          className="hig-touch-target px-2 rounded-lg text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-medium px-2 text-[var(--color-text-secondary)] tabular-nums">
          {totalSlides > 0 ? currentSlide + 1 : 0} / {totalSlides}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={currentSlide >= totalSlides - 1}
          aria-label="Próximo slide"
          className="hig-touch-target px-2 rounded-lg text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={triggerCelebration}
          aria-label="Celebrar"
          title="Celebrar com confetti"
          className="hig-touch-target px-3 rounded-lg text-xs font-medium text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <PartyPopper className="w-4 h-4 text-amber-500 mr-1.5" />
          Celebrar
        </button>

        <button
          type="button"
          onClick={onStartPresentation}
          aria-label="Iniciar Apresentação"
          className="hig-touch-target px-4 rounded-lg text-xs font-semibold text-white bg-[var(--color-accent)] hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
          Apresentar
        </button>
      </div>
    </header>
  )
}
