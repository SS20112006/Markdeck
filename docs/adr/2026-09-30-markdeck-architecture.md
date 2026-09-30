# Markdeck Architecture and Slide Engine Design

* Status: accepted
* Deciders: Principal Architect / Orchestrator, User
* Date: 2026-09-30

## Context and Problem Statement
Markdeck is a modern presentation application built with React 19, TypeScript, and Vite that compiles Markdown into interactive slide decks. We need an architecture that supports real-time split-screen editing, strict Apple HIG compliance, decoupled slide parsing with speaker notes, fluid transitions, and presentation modes.

## Decision Drivers
* Apple Human Interface Guidelines: SF Pro typography optical sizing (Text <=19pt vs Display >=20pt), WCAG AA contrast (>=4.5:1), native semantic materials, touch targets >= 44x44px.
* Real-time split-screen editing using CodeMirror v6 with markdown syntax highlighting.
* Decoupled slide parser supporting `---` delimiter and speaker notes extraction.
* Cinematic transitions with Framer Motion and interactive reactions with Canvas Confetti.
* Clean domain separation and strict Conventional Commits 1.0.0.

## Considered Options
* Option 1: Monolithic App component with inline regex parsing and raw HTML injection.
* Option 2: Decoupled modular domain architecture with typed `SlideData` model, pure functional parser (`parser.ts`), CodeMirror editor component, Apple HIG presentation canvas, and dedicated keyboard navigation hook.

## Decision Outcome
Chosen option: "Option 2", because it guarantees maintainability, modularity, type safety, and seamless Apple HIG user ergonomics.

### Positive Consequences
* Testable, pure parsing logic for slides, speaker notes, and frontmatter.
* High-performance 60fps transitions via Framer Motion.
* Strict compliance with Apple HIG design tokens and dark mode appearances.
* Predictable state lifecycle for editor vs presentation modes.

### Negative Consequences
* Requires initial modular file scaffolding (`src/types/`, `src/lib/`, `src/components/`).

## Sub-Agent Delegation Plan
1. Apple HIG Specialist: Configure Tailwind v4 tokens, macOS vibrancy materials, and toolbar/canvas components.
2. Full-Stack Implementation Engineer: Build `src/types/deck.ts`, `src/lib/parser.ts`, `src/components/Editor/`, and `src/components/Slide/`.
3. QA & Security Agent: Validate TypeScript type checks and AST linting via Oxlint.
4. DevOps Agent: Commit atomic changes adhering to Conventional Commits 1.0.0.
