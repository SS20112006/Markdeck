# 🗺️ Markdeck — Roadmap & Task List v2.0

> Documento de planeamento e lista de tarefas para a evolução do Markdeck da versão 1.0 (MVP) para uma ferramenta de apresentações de nível profissional.

---

## 📌 Ponto 1: Realce de Código & Diagramas Técnicos (Developer Experience)
*Foco: Elevar o valor do Markdeck para engenheiros de software, arquitetos e oradores técnicos.*

- [ ] **Task 1.1 — Syntax Highlighting Colorido**:
  - Integrar motor de realce de código (`highlight.js` ou `Prism.js`) no parser de Markdown.
  - Suportar linguagens essenciais: TypeScript, JavaScript, Python, Rust, Go, SQL, Bash, HTML, CSS, JSON, YAML.
- [ ] **Task 1.2 — Temas de Código Apple HIG**:
  - Estilização nativa inspirada no Xcode / SF Mono com alternância automática entre Light Mode e Dark Mode.
  - Botão de cópia rápida de blocos de código com feedback tátil.
- [ ] **Task 1.3 — Renderização de Diagramas Mermaid**:
  - Adicionar suporte a blocos ````mermaid```` renderizados como SVG interativo dentro do slide.
  - Suporte a diagramas de fluxo, arquitetura de sistemas, diagramas de sequência e entidades (ER).
- [ ] **Task 1.4 — Diretivas de Layout por Slide**:
  - Suporte a anotações como `<!-- layout: 2-columns -->` para criar automaticamente slides comparativos com duas colunas.
  - Suporte a alinhamento customizado (`<!-- align: center -->` ou `<!-- align: top -->`).

---

## 📌 Ponto 2: Ecrã de Apresentador & Visão Geral em Grelha (Speaker Experience)
*Foco: Proporcionar controlo total e confiança durante palestras em auditórios e reuniões.*

- [ ] **Task 2.1 — Presenter View com Monitor Duplo (`P`)**:
  - Abrir janela independente de orador via `window.open` e sincronizar navegação com `BroadcastChannel API`.
  - Permitir projetar o slide no ecrã principal enquanto o orador mantém as notas no portátil.
- [ ] **Task 2.2 — Layout da Consola do Orador**:
  - Visão simultânea do **Slide Atual** e da **Pré-visualização do Próximo Slide**.
  - Exibição de **Notas do Orador** com tipografia escalável para leitura à distância.
- [ ] **Task 2.3 — Temporizador de Palestra em Tempo Real**:
  - Cronómetro de tempo decorrido, relógio de parede do sistema e alertas visuais de ritmo (ex.: aviso aos 15 minutos).
- [ ] **Task 2.4 — Visão Geral em Grelha / Light Table (`G`)**:
  - Modal ou gaveta visual com miniaturas de todos os slides para saltar diretamente para qualquer slide durante a sessão de perguntas e respostas (Q&A).

---

## 📌 Ponto 3: Gestão de Múltiplos Decks & Partilha por URL (Productivity & Cloud)
*Foco: Facilitar a gestão contínua de várias palestras e a partilha imediata sem fricção.*

- [ ] **Task 3.1 — Biblioteca de Múltiplas Apresentações**:
  - Barra lateral de documentos para alternar entre várias apresentações guardadas no `localStorage` (ex.: *"Pitch Deck"*, *"Apresentação Semanal"*, *"Arquitetura Q4"*).
  - Funcionalidades de criar novo deck, duplicar, renomear e arquivar.
- [ ] **Task 3.2 — Partilha Instantânea via URL Hash**:
  - Comprimir o documento Markdown na URL (usando `lz-string` ou compressão de base64) para que qualquer pessoa abra a apresentação diretamente pelo link, sem necessidade de base de dados.
- [ ] **Task 3.3 — Backup e Exportação Completa**:
  - Exportar e importar todos os decks guardados em formato JSON unificado para migração entre máquinas.

---

## 📊 Estado de Implementação
* **v1.0 (Lançada)**: Core Split-View, CodeMirror v6, Apple HIG Design Tokens, Drag & Drop Finder, Fullscreen Nativo, PDF Export, LocalStorage, GitHub Pages CI/CD.
* **v2.0 (Em progresso)**: Tarefas acima descritas.
