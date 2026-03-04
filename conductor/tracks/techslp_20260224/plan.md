# Implementation Plan: Tech SLP

## Phase 1: Scaffold and Setup
- [ ] Task: Initialize project with Vite + React + TypeScript + Tailwind + GSAP
    - [ ] Install core dependencies (tailwindcss, gsap, lucide-react)
    - [ ] Install dev toolchain (vitest, testing-library, playwright)
    - [ ] Configure Vitest, Playwright, TypeScript strict mode
- [ ] Task: Create base file structure and global styles
    - [ ] Directory tree (components, hooks, utils, assets, contexts, styles)
    - [ ] index.css with Tailwind directives and GSAP utility classes
    - [ ] ESLint and Prettier configuration
- [ ] Task: Create GitHub repository and push initial scaffold
- [ ] Task: Initialize conductor tracking
- [ ] Task: Conductor - Phase 1 Verification

## Phase 2: Design DNA and Design System
- [ ] Task: Research industry and competitors
- [ ] Task: Lock Design DNA (Soft Brutalism)
- [ ] Task: Create design system document (DESIGN-DNA.md)
- [ ] Task: Implement design tokens (CSS custom properties)
- [ ] Task: Configure Tailwind with design system tokens
- [ ] Task: Create global styles and component token patterns
- [ ] Task: Conductor - Phase 2 Verification

## Phase 3: Component Build
- [ ] Task: Plan section lineup and interaction strategy
- [ ] Task: Set up GSAP animation infrastructure (animations.ts)
- [ ] Task: Build layout components (Container, Navbar, Footer)
- [ ] Task: Build Hero section
- [ ] Task: Build Features/Services section
- [ ] Task: Build About/Philosophy section
- [ ] Task: Build Problem section
- [ ] Task: Build Portfolio section
- [ ] Task: Build Contact section (CTA/FormSubmit)
- [ ] Task: Source all images and text content
- [ ] Task: Assemble App.tsx, verify responsive layouts
- [ ] Task: Verify production build compiles cleanly
- [ ] Task: Conductor - Phase 3 Verification

## Phase 4: Quality Gates
- [ ] Task: Vitest suite — all tests pass, coverage >80%
- [ ] Task: Playwright browser tests — all viewports pass
- [ ] Task: Lighthouse audit — P>90, A>95, BP>90, SEO>90
- [ ] Task: Skeptical design review — all 7 questions pass
- [ ] Task: Code review — TypeScript clean, ESLint clean
- [ ] Task: Accessibility audit — axe-core 0 violations
- [ ] Task: Fix loop — resolve failures and re-run all gates
- [ ] Task: Conductor - Phase 4 Verification

## Phase 5: Deploy and Launch
- [ ] Task: Pre-deploy checks
- [ ] Task: Deploy
- [ ] Task: Launch checklist
- [ ] Task: Conductor - Phase 5 Verification
