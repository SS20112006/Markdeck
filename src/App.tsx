import { useState, useMemo, useCallback } from 'react'
import { parseMarkdownToSlides, INITIAL_DECK_MARKDOWN } from './lib/parser'
import { Toolbar } from './components/Toolbar/Toolbar'
import { EditorPane } from './components/Editor/EditorPane'
import { SlideView } from './components/Slide/SlideView'
import { PresentationMode } from './components/Presentation/PresentationMode'
import { FileUp } from 'lucide-react'

export default function App() {
  const [markdown, setMarkdown] = useState<string>(INITIAL_DECK_MARKDOWN)
  const [fileName, setFileName] = useState<string>('apresentacao.md')
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0)
  const [isPresenting, setIsPresenting] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

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

  // Drag and drop handlers for external .md files
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Check if the cursor truly left the container
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
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative flex flex-col h-screen w-screen overflow-hidden bg-[var(--color-bg-canvas)] select-none"
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

      {/* Drag & Drop Visual Overlay (Apple HIG Translucent Modal) */}
      {isDragging && (
        <div className="absolute inset-0 z-50 hig-regular-material bg-[var(--color-bg-material)]/90 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none transition-all border-4 border-dashed border-[var(--color-accent)] m-4 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent)] flex items-center justify-center mb-4">
            <FileUp className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
            Largar ficheiro Markdown
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Solte o ficheiro .md para carregar imediatamente a apresentação
          </p>
        </div>
      )}
    </div>
  )
}
