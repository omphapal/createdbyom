---
name: portfolio-guardrails
description: Critical guardrails for Omkar Phapal's portfolio (createdbyom) protecting existing 3D animations, brand aesthetics, performance, and accessibility.
---

# Portfolio Guardrails — Omkar Phapal (`createdbyom`)

This skill defines the mandatory rules and architectural guardrails for developing and updating Omkar Phapal's portfolio website.

## 1. Absolute Protection of the 3D Office Animation
- **Never modify, replace, delete, or rewrite the Cables.gl 3D Office Scene** (`#glcanvas`, `.anim--wrapper`).
- **Never modify** camera angles, 3D desk geometry, chair, computer models, lighting, or scroll timeline.
- The 3D monitor video texture is loaded via `monitor-video.js` targeting `assets/monitor-video.mp4` (Ronaldo & Messi dream guitar video). Do not break this hook.
- All new visual storytelling sections must be placed **AFTER** the office animation, never inside or overlying it.

## 2. Protected Animations Registry
- Refer to `PROTECTED_ANIMATIONS.md` before making CSS or JavaScript changes.
- Existing view transitions, logo marquees, title failsafes, and statement screen scrubbers are strictly read-only.
- All new animations must use isolated, uniquely scoped CSS classes.

## 3. Brand & Visual Design Identity
- **Primary Brand Color:** Lavender `#ede1fd` with warm off-white and charcoal contrast.
- Clean typography hierarchy, subtle 1px borders, soft layered shadows.
- No generic dark AI cyberpunk dashboards, no excessive glassmorphism.
- Honest claims: Omkar Phapal is a freelance Java & Spring Boot developer, BCA graduate from Pune, India. No fake client logos or unsupported stats.

## 4. Performance & Accessibility
- Lighthouse targets: ≥ 95 Performance, Accessibility, Best Practices, SEO.
- LCP ≤ 2.5s, CLS ≤ 0.05, INP ≤ 200ms.
- 100% `prefers-reduced-motion: reduce` compliance for all new motion.
- Minimum 44x44px touch targets on mobile.

## 5. Deployment & Vercel
- Pure static serving via `@vercel/static` in `vercel.json`.
- Do not push directly to remote without explicit user instruction.
