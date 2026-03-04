# DESIGN DNA: Soft Brutalism

## Concept
"Architectural, weighty, unapologetic—yet warmly human and quietly refined." 

Soft Brutalism merges the strict grid logic and stark contrasts of brutalist web design with high-end, organic elements. Instead of the aggressive neons and chaotic layouts of 90s brutalism, this approach uses warm, muted colors, soft but deep drop shadows, and incredibly generous border radii nested inside rigid outer containers.

## Typography
- **Display Setup**: Space Grotesk (Bold, tight tracking, massive scale contrast)
- **Body Setup**: DM Sans (Regular/Medium, highly readable, generous line height)
- **Mono Accent**: Space Mono (Used for dates, tags, micro-copy, and technical data)

## Color System (Earth & Architecture)
- **Surface**: `var(--color-surface)` - Pure White `#FFFFFF` for maximum starkness.
- **Background**: `var(--color-bg)` - Warm Oatmeal/Off-White `#F7F5F0` to soften the edges.
- **Text/Line**: `var(--color-text)` - Near Black/Charcoal `#2D2A26` for deep contrast without pure #000 harshness.
- **Primary Accent**: `var(--color-primary)` - Warm Terracotta `#D05E41` for CTAs and interactive thrust.
- **Secondary Accent**: `var(--color-secondary)` - Soft Sage `#8FA596` for calm, clinical trust signals.

## Texture & Layout
- **Global Texture**: Noticeable SVG film grain (0.02 - 0.04 opacity) layered over everything.
- **Borders & Shadows**: Thick borders (2px) and harsh, unblurred offset drop shadows (`4px 4px 0 var(--color-text)`).
- **Radii Layering**: Outer containers might be razor sharp (`rounded-none`), while nested cards feature extreme roundness (`rounded-3xl` or `rounded-full`).

## Motion Language
- **Physics**: Heavy, physical, and deliberate. Elements don't "float"; they arrive with a "thud".
- **Easing**: Custom cubic-bezier mimicking strong spring physics (`0.25, 1, 0.5, 1`).
- **Scroll**: Content is revealed aggressively from behind strict masking layers as the user scrolls.
