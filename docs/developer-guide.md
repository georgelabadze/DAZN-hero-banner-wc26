# Developer Guide: DAZN Hero Banner WC26

## Stack
- Vite + React
- Multi-page build with:
  - `index.html` for the live demo
  - `documentation.html` for the visual guideline page
- Runtime glow sampling with canvas + `ResizeObserver`

## Project Structure
- `src/App.jsx`: live demo composition, settings state, and prop wiring
- `src/config/heroDemoConfig.js`: content, media sets, header config, defaults
- `src/components/SiteHeader.jsx`: default and countdown header variants
- `src/components/HeroBanner.jsx`: responsive hero card
- `src/components/HeroCarousel.jsx`: carousel prototype overlay
- `src/components/HeroSettingsPanel.jsx`: demo settings UI
- `src/components/HeroFooterLinks.jsx`: bottom resource links
- `src/hooks/useHeroGlow.js`: image/video glow sampling and geometry logic
- `src/styles/base.css`: global tokens, fonts, shell layout
- `src/styles/site-header.css`: header block styles
- `src/styles/hero-banner.css`: hero block styles
- `src/styles/hero-carousel.css`: carousel block styles
- `src/styles/hero-settings.css`: settings block styles
- `src/styles/hero-footer-links.css`: bottom resource links styles

## Public Component Contract
### `SiteHeader`
- `variant?: "countdown" | "default"`
- `logoSrc: string`
- `actions?: { label: string; variant: "secondary" | "primary"; href?: string }[]`
- `countdownTarget?: string | Date`
- `countdownCta?: { label: string; href?: string }`
- `eventBrand?: { logoSrc: string; title: string; subtitle: string }`

### `HeroBanner`
- `media: { desktop: MediaItem; tablet: MediaItem; mobile: MediaItem }`
- `MediaItem = { kind: "image" | "video"; src: string; poster?: string; alt?: string }`
- `copy: { logo?; label?; title; subtitle; price?; helperText? }`
- `cta: { label: string; href: string; variant?: "primary" | "secondary" }[]`
- `focus?: { desktop?: string; tablet?: string; mobile?: string }`
- `layout?: { contentAlignment?: "left" | "center"; theme?: "gold" | "standard"; titleSize?: "large" | "larger" }`
- `carousel?: { totalSlides: number; activeIndex: number } | null`
- `alt: string`

## Breakpoints and Layout Rules
- Desktop: `1025px` and above
  - `16:9` is the target creative ratio
  - height caps against the available viewport after subtracting the `64px` header
  - soft minimum height uses a `34rem` baseline and relaxes on shorter viewports
  - outer gutter is `64px`
  - hero radius is `18px`
- Tablet: `768px` to `1024px`
  - `5:7` is the target creative ratio
  - height caps against the available viewport after subtracting the `64px` header and reserving a small below-section peek
  - minimum height uses a bounded `32rem` baseline so the next section can still remain partly visible
  - in rotated or short-height cases, more page scroll is expected and intentional
  - outer gutter is `32px`
  - hero radius is `14px`
- Mobile: `767px` and below
  - `9:16` is the target creative ratio
  - height caps against the available viewport after subtracting the `64px` header and reserving a small below-section peek
  - minimum height uses a bounded `33rem` baseline so the next section can still remain partly visible
  - in rotated or short-height cases, more page scroll is expected and intentional
  - outer gutter is `16px`
  - hero radius is `14px`

## Header Rules
- Header height is `64px`
- DAZN logo is `32 x 32`
- Header action buttons keep `72 x 40`
- Default header:
  - secondary button uses `#3d4549`
  - primary button uses white background with dark text
- Countdown header:
  - shares the same shell width and top alignment
  - uses live countdown values for `days / hours / mins / secs`

## Hero Rules
- Desktop content measure is `50%` of the hero width
- Desktop content can be left aligned or centered
- Tablet and mobile content stay centered
- Gold theme:
  - applies gold gradient to the title accent
  - applies the same gradient to the primary CTA
- Standard theme:
  - title accent returns to plain text color
  - primary CTA returns to the white button style

## Glow System
- Glow is rendered inside `.hero-banner-demo`
- Glow is centered on the measured hero card, not the viewport
- Card bounds are measured with `ResizeObserver`
- Geometry is clamped so glow never increases layout width
- The active media is sampled in four regions:
  - top center
  - left middle
  - right middle
  - lower middle
- Images are sampled once after load
- Videos are sampled from live frames at a throttled rate
- Poster art is used as the first glow state and as the fallback if video sampling fails

## Video Behavior
- Videos autoplay, loop, stay muted, and play inline
- `preload="metadata"` is used
- Matching poster frames are required for all video media items
- Image and video share the same object-position focus logic

## Border System
- Base border: `1px solid rgba(255, 255, 255, 0.1)`
- Overlay border is a masked vertical gradient with these stops:
  - `0%`: `rgba(255, 255, 255, 0)`
  - `30%`: `rgba(255, 250, 0, 0.6)`
  - `50%`: `rgba(255, 170, 0, 0.4)`
  - `70%`: `rgba(100, 252, 220, 0.2)`
  - `100%`: `rgba(255, 255, 255, 0)`

## Adoption Notes
- `heroDemoConfig.js` is the clean starting point for implementation handoff
- The live settings panel is demo-only and should not be treated as production product UI
- The hero component API is media-first; there is no legacy image fallback path in the v1 component
- The visual docs page is the preferred entry point for creative review, while this file is the developer handoff reference

## QA Checklist
- Confirm `npm run build` succeeds
- Confirm both entrypoints build:
  - `index.html`
  - `documentation.html`
- Confirm header, hero, carousel, glow, and settings behave the same as the live demo
- Check `1440`, `1024`, `768`, `390`, and `375`
- Confirm settings rows keep the left-toggle, right-copy layout on all breakpoints
- Confirm bottom resource links align with the shell and wrap cleanly on mobile
