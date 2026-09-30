export interface SlideData {
  id: string
  index: number
  rawMarkdown: string
  html: string
  notes?: string
}

export interface DeckConfig {
  title: string
  author?: string
  theme?: 'apple-light' | 'apple-dark' | 'auto'
}

export interface DeckState {
  slides: SlideData[]
  currentSlideIndex: number
  isPresenting: boolean
  isSplitView: boolean
  config: DeckConfig
}
