import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { Code2 } from 'lucide-react'

interface EditorPaneProps {
  value: string
  onChange: (value: string) => void
}

export const EditorPane: React.FC<EditorPaneProps> = ({ value, onChange }) => {
  return (
    <section className="w-1/2 h-full flex flex-col border-r border-[var(--color-bg-material-border)] bg-white dark:bg-[#16171d]">
      <div className="h-9 px-4 flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)] border-b border-[var(--color-bg-material-border)] select-none bg-[var(--color-bg-canvas)]">
        <div className="flex items-center">
          <Code2 className="w-3.5 h-3.5 mr-1.5" />
          <span>MARKDOWN SOURCE</span>
        </div>
        <span className="text-[10px] opacity-70">Separe com '---'</span>
      </div>

      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={value}
          height="100%"
          extensions={[markdown()]}
          onChange={(val) => onChange(val)}
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: true,
          }}
          className="text-sm font-mono"
        />
      </div>
    </section>
  )
}
