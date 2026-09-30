import { useState, useMemo } from 'react'
import { parseMarkdownToSlides, INITIAL_DECK_MARKDOWN } from './lib/parser'
import { Toolbar } from './components/Toolbar/Toolbar'
import { EditorPane } from './components/Editor/EditorPane'
import { SlideView } from './components/Slide/SlideView'
import { PresentationMode } from './components/Presentation/PresentationMode'

export default function App() {
  const [markdown, setMarkdown] = useState<string>(INITIAL_DECK_MARKDOWN)
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0)
  const [isPresenting, setIsPresenting] = useState<boolean>(false)

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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--color-bg-canvas)] select-none">
      {/* Top Application Toolbar */}
      <Toolbar
        currentSlide={safeIndex}
        totalSlides={slides.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onStartPresentation={() => setIsPresenting(true)}
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
    </div>
  )
}
