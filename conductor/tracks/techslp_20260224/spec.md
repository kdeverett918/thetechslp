# Track Specification: Tech SLP

## Overview
A complete ground-up build of the Tech SLP portfolio site. The site serves Speech-Language Pathologists who need technical, design, and app development work.

## Functional Requirements
- High-conversion Landing/Hero section
- About / Value Proposition section
- Services / "Why Me" pricing & features section
- Problem / Solution educational section
- Projects / Portfolio showcase
- Contact section with FormSubmit infrastructure

## Non-Functional Requirements
- React 19 + TypeScript + Vite + Tailwind CSS 3.4
- GSAP 3 (ScrollTrigger) with cinematic motion physics
- "Soft Brutalism" aesthetic (edgy but warm, structural layout with organic elements)
- Fully accessible (WCAG AA) and responsive across all viewports
- Lighthouse targets: Performance >90, Accessibility >95, Best Practices >90, SEO >90

## Acceptance Criteria
- Visually unique design system that does not resemble stock templates
- Vitest unit tests and Playwright browser tests pass
- No console errors or warnings in production compile

## Out of Scope
- Fully custom backend CMS or databases (using static files + FormSubmit)
