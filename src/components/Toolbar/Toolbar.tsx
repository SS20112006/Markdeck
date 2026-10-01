import React, { useRef } from 'react'
import {
  Play,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  FolderOpen,
  Download,
  Printer,
  RotateCcw,
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface ToolbarProps {
  fileName: string
  currentSlide: number
  totalSlides: number
  onPrev: () => void
  onNext: () => void
  onStartPresentation: () => void
  onImportFile: (content: string, fileName: string) => void
  onExportFile: () => void
  onResetDemo: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  fileName,
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onStartPresentation,
  onImportFile,
  onExportFile,
  onResetDemo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
    })
  }

  const handleOpenClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (typeof content === 'string') {
        onImportFile(content, file.name)
      }
    }
    reader.readAsText(file)

    // Reset input so the same file can be selected again
    e.target.value = ''
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <header className="hig-regular-material h-14 px-4 flex items-center justify-between z-20 select-none">
      {/* Hidden file input for native file picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md,.markdown,text/markdown,text/plain"
        className="hidden"
      />

      {/* Brand & Document Name */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xs shadow-sm">
          MD
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-tight text-[var(--color-text-primary)]">
            Markdeck
          </h1>
          <p
            className="text-[11px] text-[var(--color-text-secondary)] truncate max-w-[150px] sm:max-w-xs"
            title={fileName}
          >
            {fileName}
          </p>
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

      {/* Actions & Utilities */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        <button
          type="button"
          onClick={handleOpenClick}
          aria-label="Abrir ficheiro Markdown"
          title="Importar ficheiro .md do computador"
          className="hig-touch-target px-2.5 rounded-lg text-xs font-medium text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <FolderOpen className="w-4 h-4 sm:mr-1.5 text-[var(--color-accent)]" />
          <span className="hidden sm:inline">Abrir</span>
        </button>

        <button
          type="button"
          onClick={onExportFile}
          aria-label="Guardar ficheiro Markdown"
          title="Descarregar ficheiro .md atual"
          className="hig-touch-target px-2.5 rounded-lg text-xs font-medium text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Download className="w-4 h-4 sm:mr-1.5 text-[var(--color-text-secondary)]" />
          <span className="hidden sm:inline">Guardar</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          aria-label="Imprimir ou Exportar para PDF"
          title="Imprimir ou Exportar para PDF (Cmd+P)"
          className="hig-touch-target px-2.5 rounded-lg text-xs font-medium text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Printer className="w-4 h-4 sm:mr-1.5 text-[var(--color-text-secondary)]" />
          <span className="hidden sm:inline">PDF</span>
        </button>

        <button
          type="button"
          onClick={onResetDemo}
          aria-label="Repor apresentação de exemplo"
          title="Repor slides de exemplo"
          className="hig-touch-target p-2 rounded-lg text-xs text-[var(--color-text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={triggerCelebration}
          aria-label="Celebrar"
          title="Celebrar com confetti"
          className="hig-touch-target p-2 rounded-lg text-xs text-amber-500 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <PartyPopper className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onStartPresentation}
          aria-label="Iniciar Apresentação"
          className="hig-touch-target px-3.5 rounded-lg text-xs font-semibold text-white bg-[var(--color-accent)] hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
          Apresentar
        </button>
      </div>
    </header>
  )
}
