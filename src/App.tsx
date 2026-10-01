import { useState, useMemo, useCallback, useEffect } from 'react'
import { parseMarkdownToSlides, INITIAL_DECK_MARKDOWN } from './lib/parser'
import { Toolbar } from './components/Toolbar/Toolbar'
import { EditorPane } from './components/Editor/EditorPane'
import { SlideView } from './components/Slide/SlideView'
import { PresentationMode } from './components/Presentation/PresentationMode'
import { ShortcutsModal } from './components/Shortcuts/ShortcutsModal'
import { Logo } from './components/Brand/Logo'

const STORAGE_KEY_CONTENT = 'markdeck:content'
const STORAGE_KEY_FILENAME = 'markdeck:filename'

export default function App() {
  // Initialize state with local storage fallback
  const [markdown, setMarkdown] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_CONTENT) || INITIAL_DECK_MARKDOWN
  })
  const [fileName, setFileName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_FILENAME) || 'apresentacao.md'
  })
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0)
  const [isPresenting, setIsPresenting] = useState<boolean>(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Persist edits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTENT, markdown)
    } catch {
      // Handle quota exceeded gracefully
    }
  }, [markdown])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FILENAME, fileName)
    } catch {
      // Handle quota exceeded gracefully
    }
  }, [fileName])

  // Global Keyboard Shortcuts (Cmd+Enter to present, ? for shortcuts modal)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to toggle presentation
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        setIsPresenting((prev) => !prev)
        return
      }

      // Check if user is typing in editor or input field
      const target = e.target as HTMLElement
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('.cm-editor'))

      // '?' opens shortcuts modal when not typing in editor
      if (!isInput && e.key === '?') {
        e.preventDefault()
        setIsShortcutsOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Parse markdown into structured slide objects
  const slides = useMemo(() => parseMarkdownToSlides(markdown), [markdown])

  // Safeguard active slide index
  const safeIndex = Math.min(Math.max(0, currentSlideIndex), Math.max(0, slides.length - 1))
  const currentSlide = slides[safeIndex]

  const handleNext = () => {
    if (safeIndex < slides.length - 1) {
      setCurrentSlideIndex(safeIndex + 1)
    }
  }

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentSlideIndex(safeIndex - 1)
    }
  }

  const handleImportFile = useCallback((content: string, name: string) => {
    setMarkdown(content)
    setFileName(name)
    setCurrentSlideIndex(0)
  }, [])

  const handleExportFile = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName.endsWith('.md') ? fileName : `${fileName}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [markdown, fileName])

  const handleResetDemo = useCallback(() => {
    if (
      window.confirm(
        'Tem a certeza que deseja repor a apresentação de exemplo? As alterações não gravadas serão substituídas.',
      )
    ) {
      setMarkdown(INITIAL_DECK_MARKDOWN)
      setFileName('apresentacao.md')
      setCurrentSlideIndex(0)
      localStorage.removeItem(STORAGE_KEY_CONTENT)
      localStorage.removeItem(STORAGE_KEY_FILENAME)
    }
  }, [])

  // Drag and drop handlers for external .md files
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (typeof content === 'string') {
        handleImportFile(content, file.name)
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      {/* Interactive Screen View */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="screen-only relative flex flex-col h-screen w-screen overflow-hidden bg-[var(--color-bg-canvas)] select-none"
      >
        {/* Top Application Toolbar */}
        <Toolbar
          fileName={fileName}
          currentSlide={safeIndex}
          totalSlides={slides.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onStartPresentation={() => setIsPresenting(true)}
          onImportFile={handleImportFile}
          onExportFile={handleExportFile}
          onResetDemo={handleResetDemo}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        {/* Split-View Workspace: Editor & Live Slide Preview */}
        <main className="flex-1 flex overflow-hidden">
          <EditorPane value={markdown} onChange={setMarkdown} />
          <SlideView slide={currentSlide} />
        </main>

        {/* Fullscreen Presentation Mode */}
        {isPresenting && (
          <PresentationMode
            slides={slides}
            currentIndex={safeIndex}
            onClose={() => setIsPresenting(false)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {/* Keyboard Shortcuts Reference Dialog */}
        <ShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />

        {/* Drag & Drop Visual Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 hig-regular-material bg-[var(--color-bg-material)]/90 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none transition-all border-4 border-dashed border-[var(--color-accent)] m-4 rounded-3xl">
            <div className="mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1 font-display">
              Largar ficheiro Markdown no Markdeck
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Solte o ficheiro .md para carregar imediatamente a apresentação
            </p>
          </div>
        )}
      </div>

      {/* Printable / PDF Export View (Rendered only during print) */}
      <div className="print-only">
        {slides.map((s, idx) => (
          <div key={s.id || idx} className="print-slide-page">
            <div className="w-full max-w-4xl aspect-[16/9] border border-gray-200 rounded-xl p-12 flex flex-col justify-center text-left">
              <div
                className="prose max-w-none [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>p]:text-lg [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:font-mono [&>code]:bg-gray-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded"
                dangerouslySetInnerHTML={{ __html: s.html }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
