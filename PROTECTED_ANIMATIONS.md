# PROTECTED ANIMATIONS & INTERACTIVE MOTION SYSTEMS
**Repository:** `omphapal/createdbyom`  
**Baseline Commit / Tag:** `pre-premium-upgrade`  
**Rule:** Absolute protection. Never remove, rewrite, replace, retime, restyle, or recreate an existing animation.

## Executive Protection Registry

| ID | Animation / System | File | Selector / Element | Timing | Trigger | Library | Protected |
|---|---|---|---|---|---|---|---|
| PA-01 | Cables.gl 3D Office Scene | `index.html` | `#glcanvas`, `.anim--wrapper` | Continuous WebGL render loop | Page load & scroll timeline | Cables.gl (`combined-20261106-205544.br.js`) | **ABSOLUTE PROTECTED** |
| PA-02 | Cables Office Boot / Settle | `index.html` | `#glcanvas` | `settleFrames: 6, maxWait: 500ms` | RenderGuardInit / Boot | RenderGuard 1.1.0 | **ABSOLUTE PROTECTED** |
| PA-03 | 3D Canvas Fade Out on Scroll | `index.html`, `404.html`, `about-us` | `html.is-lite-3d #glcanvas` | `linear both; cover 26% to cover 31%` | CSS Scroll timeline (`view()`) | Native CSS View Timeline | **ABSOLUTE PROTECTED** |
| PA-04 | View Transition Cover | `index.html`, `404.html`, `about-us` | `::view-transition-old(root)`, `::view-transition-new(root)` | `var(--vt-cover, .6s) cubic-bezier(.76, 0, .24, 1)` | Navigation click | CSS View Transitions Level 2 | **PROTECTED** |
| PA-05 | View Transition Clip Morph | `index.html`, `404.html`, `about-us` | `::view-transition-group(vt-overlay)` | `var(--vt-morph, .55s)` | Active view transition overlay | CSS View Transitions Level 2 | **PROTECTED** |
| PA-06 | Hero Logo Marquee (Trusted-By) | `index.html`, `404.html`, `about-us` | `.hero-statement__logos-clip.is-marquee .hero-statement__logo-stripe` | `30s linear infinite` (26s on tablet, 18s on mobile) | Mobile/Tablet viewport breakpoint | CSS Keyframes (`hero-logo-marquee`) | **PROTECTED** |
| PA-07 | Section Hero Title Failsafe | `index.html`, `404.html`, `about-us` | `.section-hero__title` | `0s 2.5s forwards` | Page load fallback | CSS Keyframes | **PROTECTED** |
| PA-08 | Statement Dual Screen Switcher | `index.html` | `.statement.old-screen`, `.statement.new-screen` | Scroll scrub / Intersection | Scroll observer | Webflow IX3 / Native JS | **PROTECTED** |
| PA-09 | Marquee Strip (Skills / Tech) | `enhancements.css` | `.op-marquee__track` | `32s linear infinite` | Constant run | CSS Keyframes (`op-marquee`) | **PROTECTED** |
| PA-10 | Line In Title Reveal | `enhancements.css` | `.op-intro__line span` | `0.85s cubic-bezier(0.16, 1, 0.3, 1)` | Intro section intersection | CSS Keyframes (`op-line-in`) | **PROTECTED** |
| PA-11 | Architecture Chart Draw | `enhancements.css` | `.op-app__chart span` | `0.9s cubic-bezier(0.16, 1, 0.3, 1)` | Card reveal | CSS Keyframes (`op-bar`) | **PROTECTED** |
| PA-12 | SVG Architecture Flow Line | `enhancements.css` | `.op-arch__path` | `2.4s ease-in-out infinite alternate` | Active panel visibility | CSS Keyframes (`op-draw`) | **PROTECTED** |
| PA-13 | Availability Pulse Dot | `enhancements.css` | `.op-availability-dot::after` | `2s cubic-bezier(0.4, 0, 0.6, 1) infinite` | Continuous | CSS Keyframes (`op-pulse-ring`) | **PROTECTED** |
| PA-14 | Subtle Floating Badge | `enhancements.css` | `.op-float-subtle` | `6s ease-in-out infinite` | Continuous | CSS Keyframes (`op-float-subtle`) | **PROTECTED** |
| PA-15 | 3D Monitor Video Texture Patch | `monitor-video.js` | Operator `Ops.Team.TheDigitalPanda_BohMLn.VimeoTexture` | Realtime video loop | `CABLES.Patch.prototype.deSerialize` hook | Cables runtime hook | **ABSOLUTE PROTECTED** |

## Non-Negotiable Constraints
1. **Never touch the 3D office scene**: `#glcanvas`, `.anim--wrapper`, camera angles, desk, computer, lighting, Cables patch data.
2. **Never change timing or easing** of existing animations.
3. **Additive motion only**: All new motion, parallax, and storytelling visuals must be placed *after* the existing office animation in dedicated, scoped elements.
4. **Reduced Motion**: All new motion respects `prefers-reduced-motion: reduce`.
