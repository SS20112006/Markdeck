import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Logo } from '../Brand/Logo'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ShortcutItem {
  keys: string[]
  description: string
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['⌘ / Ctrl', 'Enter'], description: 'Iniciar Apresentação' },
  { keys: ['→', 'Espaço'], description: 'Próximo slide' },
  { keys: ['←'], description: 'Slide anterior' },
  { keys: ['C'], description: 'Lançar Confetti festivo' },
  { keys: ['Esc'], description: 'Sair da apresentação / Fechar' },
  { keys: ['⌘ / Ctrl', 'P'], description: 'Imprimir ou Exportar para PDF' },
  { keys: ['?', '/'], description: 'Abrir este painel de atalhos' },
  { keys: ['Drag & Drop'], description: 'Importar qualquer ficheiro .md' },
]

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md hig-regular-material rounded-2xl shadow-2xl p-6 border border-[var(--color-bg-material-border)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-bg-material-border)]">
          <Logo size="sm" showText={true} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar atalhos"
            className="hig-touch-target p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="py-3 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {SHORTCUTS.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span className="text-[var(--color-text-secondary)] font-medium">
                {item.description}
              </span>
              <div className="flex items-center space-x-1.5">
                {item.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-[var(--color-text-primary)] shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--color-bg-material-border)] text-center">
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            Prima <kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">Esc</kbd> para fechar este painel
          </p>
        </div>
      </div>
    </div>
  )
}
