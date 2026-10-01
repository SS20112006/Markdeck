# Markdeck 🚀

> Apresentações modernas, elegantes e instantâneas a partir de **Markdown**, construídas com a estética e ergonomia das **Apple Human Interface Guidelines (HIG)**.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Funcionalidades Principais

* **Split-View em Tempo Real**: Edição em Markdown lado a lado com preview imediato e sincronizado.
* **Apple HIG & Tipografia Ótica**:
  * Tipografia ajustada dinamicamente: `SF Pro Text` para corpo (`<= 19pt`) e `SF Pro Display` para títulos (`>= 20pt`).
  * Materiais translúcidos macOS (`.hig-regular-material` com `backdrop-filter: blur(20px)`).
  * Footprint mínimo de 44x44px em todos os botões e alvos interativos.
  * Suporte automático a Dark Mode e Light Mode com contraste dinâmico WCAG AA.
* **Importação & Exportação Sem Fricção**:
  * **Arrastar e Largar (Drag & Drop)**: Arraste ficheiros `.md` do seu Mac diretamente para a aplicação.
  * Diálogo nativo do sistema para abrir ficheiros locais.
  * Botão de guardar/descarregar alterações para `.md`.
* **Modo Apresentação Imersivo (Ecrã Inteiro)**:
  * Acionamento da **Fullscreen API** nativa (oculta barras do browser).
  * Navegação rápida com `Setas` ou `Espaço`.
  * Atalho `C` para celebração com *confetti*.
  * Tecla `Esc` para regressar à edição.
* **Exportação para PDF / Impressão**:
  * Estilos de impressão dedicados (`@media print` / `Cmd+P`) para gerar PDFs perfeitos com 1 slide por página em formato 16:9 paisagem.
* **Persistência Local**:
  * As edições e o nome do ficheiro são gravados no `localStorage`, evitando perda de dados por fecho acidental ou refresh.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js 20+ ou 22+
* npm

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Compilar para produção
npm run build

# 4. Pré-visualizar o pacote de produção
npm run preview
```

---

## 🌐 Deploy

O Markdeck está pré-configurado para qualquer plataforma de alojamento estático:

### 1. Vercel
Importe o repositório na dashboard da Vercel. A configuração em [`vercel.json`](file:///Users/simaosousa/Markdeck/vercel.json) já está incluída.

### 2. Netlify
Conecte o repositório no Netlify. A configuração em [`netlify.toml`](file:///Users/simaosousa/Markdeck/netlify.toml) cuidará do build (`dist/`) e dos redirects.

### 3. GitHub Pages (Automático)
O workflow de CI/CD em [`.github/workflows/deploy.yml`](file:///Users/simaosousa/Markdeck/.github/workflows/deploy.yml) compila e publica automaticamente o site a cada `git push` para o branch `main`.

---

## 📄 Licença
Distribuído sob a licença MIT.
