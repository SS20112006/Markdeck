import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SlideData } from '../../types/deck'
import { FileText } from 'lucide-react'

interface SlideViewProps {
  slide?: SlideData
  isPresentationMode?: boolean
}

export const SlideView: React.FC<SlideViewProps> = ({
  slide,
  isPresentationMode = false,
}) => {
  if (!slide) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)]">
        Nenhum slide disponível.
      </div>
    )
  }

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-6 ${
        isPresentationMode
          ? 'bg-black w-screen h-screen p-12'
          : 'bg-[var(--color-bg-canvas)]'
      }`}
    >
      <div
        className={`relative aspect-[16/9] w-full max-w-4xl bg-white dark:bg-[#1a1a1e] rounded-2xl shadow-2xl border border-[var(--color-bg-material-border)] overflow-hidden flex flex-col`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 p-10 md:p-14 flex flex-col justify-center overflow-auto text-[var(--color-text-primary)]"
          >
            <div
              className="prose dark:prose-invert max-w-none text-left [&>h1]:text-4xl [&>h1]:font-semibold [&>h1]:mb-6 [&>h1]:tracking-tight [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-4 [&>h2]:tracking-tight [&>p]:text-lg [&>p]:leading-relaxed [&>p]:text-[var(--color-text-secondary)] [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ul>li]:text-base [&>pre]:bg-black/5 dark:[&>pre]:bg-black/40 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:font-mono [&>pre]:text-sm [&>code]:bg-black/5 dark:[&>code]:bg-white/10 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded"
              dangerouslySetInnerHTML={{ __html: slide.html }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Speaker notes badge if present */}
        {slide.notes && !isPresentationMode && (
          <div className="h-10 px-6 bg-black/5 dark:bg-black/30 border-t border-[var(--color-bg-material-border)] flex items-center text-xs text-[var(--color-text-secondary)] select-none">
            <FileText className="w-3.5 h-3.5 mr-2 text-[var(--color-accent)]" />
            <span className="font-medium mr-2">Notas do Orador:</span>
            <span className="truncate">{slide.notes}</span>
          </div>
        )}
      </div>
    </div>
  )
}
