import { marked } from 'marked'
import type { SlideData } from '../types/deck'

// Configure marked with sensible defaults
marked.setOptions({
  gfm: true,
  breaks: true,
})

/**
 * Splits raw markdown into individual slide objects with parsed HTML and extracted speaker notes.
 */
export function parseMarkdownToSlides(rawMarkdown: string): SlideData[] {
  if (!rawMarkdown || rawMarkdown.trim() === '') {
    return [
      {
        id: 'slide-0',
        index: 0,
        rawMarkdown: '# Slide Vazio',
        html: marked.parse('# Slide Vazio') as string,
        notes: undefined,
      },
    ]
  }

  // Regex to split on slide boundaries: '---' on its own line
  const slideDelimiterRegex = /(?:^|\r?\n)---\r?\n/
  const rawSegments = rawMarkdown.split(slideDelimiterRegex)

  return rawSegments.map((segment, index) => {
    let slideContent = segment.trim()
    let notes: string | undefined = undefined

    // Extract speaker notes if indicated by '???' or 'Note:'
    if (slideContent.includes('\n???')) {
      const parts = slideContent.split(/\n\?\?\?[\r\n]*/)
      slideContent = parts[0].trim()
      notes = parts.slice(1).join('\n').trim()
    } else if (slideContent.includes('\nNote:')) {
      const parts = slideContent.split(/\nNote:\s*/)
      slideContent = parts[0].trim()
      notes = parts.slice(1).join('\n').trim()
    }

    const html = marked.parse(slideContent) as string

    return {
      id: `slide-${index}`,
      index,
      rawMarkdown: slideContent,
      html,
      notes,
    }
  })
}

export const INITIAL_DECK_MARKDOWN = `# Markdeck
Crie apresentações fluidas e elegantes com **Markdown**.

* Apple Human Interface Guidelines
* Atalhos intuitivos de teclado
* Efeitos cinemáticos em tempo real

???
Introduzir o conceito do Markdeck e como ele simplifica a criação de slides técnicos.
---
## Funcionalidades Principais

* **Split-View em Tempo Real**: Edição lado a lado com preview instantâneo.
* **Transições Fluídas**: Animações suaves com *Framer Motion*.
* **Totalmente Acessível**: Tipografia ótica SF Pro e rácio de contraste WCAG AA.

???
Destacar a conformidade com as regras de design da Apple.
---
## Código Limpo & Elegante

\`\`\`typescript
interface Slide {
  title: string
  content: string
  interactive: boolean
}
\`\`\`

Apresente as suas ideias com precisão e clareza.
---
# Obrigado! 🎉
Pressione **Espaço** ou **Setas** para navegar.
Clique em **Celebrar** para testar as reações.
`
