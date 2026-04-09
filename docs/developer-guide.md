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
- `src/components/SiteHeader.jsx`: default and countdown header variants with responsive fixed-scroll behavior
- `src/components/HeroBanner.jsx`: responsive hero banner and carousel handoff
- `src/components/HeroCarousel.jsx`: carousel overlay
- `src/components/HeroSettingsPanel.jsx`: demo settings UI
- `src/components/HeroFooterLinks.jsx`: bottom resource links
- `src/hooks/useHeroGlow.js`: desktop image/video glow sampling and geometry logic
- `src/styles/base.css`: global tokens, fonts, and shell layout
- `src/styles/site-header.css`: header shell, fixed states, and variant styling
- `src/styles/hero-banner.css`: hero layout, media, copy, and breakpoint-specific chrome

## Public Component Contract
### `SiteHeader`
- `variant?: "countdown" | "default"`
- `logoSrc: string`
- `actions?: { label: string; variant: "secondary" | "primary"; href?: string }[]`
- `countdownTarget?: string | Date`
- `countdownCta?: { label: string; href?: string }`
- `eventBrand?: { logoSrc: string; title: string; subtitle: string }`

### `HeroBanner`
- `deck: { mode: "single" | "carousel"; autoplayMs?: number; transitionMs?: number; slides: HeroSlide[] }`
- `HeroSlide = { id; media; focus?; layout?; logo?; label?; title?; subtitle?; price?; primaryCta?; secondaryCta?; helperText? }`
- `media: { desktop: MediaItem; tablet: MediaItem; mobile: MediaItem }`
- `MediaItem = { kind: "image" | "video"; src: string; poster?: string; alt?: string }`
- `layout?: { contentAlignment?: "left" | "center"; theme?: "gold" | "standard"; titleSize?: "large" | "larger" }`
- `focus` is used as the full media position on unconstrained layouts; when the hero becomes height-constrained, only the horizontal framing is preserved and vertical crop is top-anchored

## Breakpoints and Layout Rules
- Desktop: `1025px` and above
  - hero remains an inset `16:9` card inside the shell gutters
  - height still caps against the viewport after subtracting the `64px` header
  - minimum height uses a true `34rem` floor
  - title measure is `40%` of the hero width
  - subtitle and helper measure are `30%` of the hero width
  - desktop glow and overlay border remain active
- Tablet: `768px` to `1024px`
  - creative target stays `5:7`
  - live hero stays full width and preserves a true `5:7` frame
  - live height caps at about `85svh` so the next section remains visible
  - minimum height uses a bounded `32rem` floor against that cap
  - title measure is `80%` of the hero width
  - subtitle and helper measure are `60%` of the hero width
  - border, radius, shadow, and glow are removed
- Mobile: `767px` and below
  - creative target stays `9:16`
  - live hero becomes full-bleed and full-screen, with a small reserved peek for the next section
  - live height caps at about `85svh` so the next section remains visible
  - minimum height uses a bounded `33rem` floor against that cap
  - mobile text widths stay on the existing centered behavior
  - border, radius, shadow, and glow are removed

## Header Rules
- Header height is `64px`
- Desktop:
  - header stays in normal flow on first paint
  - once the page scrolls, the header becomes fixed
  - the fixed bar spans the viewport while the inner content stays aligned to the existing shell width and gutters
- Tablet and mobile:
  - header is fixed from first paint and overlays the hero
  - the initial state is transparent over the creative
  - on scroll, the header gains `rgba(8, 14, 18, 0.85)` background plus `blur(10px)`

## Hero Rules
- Desktop content measure remains `50%` of the hero width
- Desktop content can be left aligned or centered
- Tablet and mobile content stay centered
- Tablet and mobile use a stronger top scrim to protect the overlaid header from the creative underneath
- Live media keeps the authored focus position on unconstrained layouts; when the hero height is capped, vertical crop switches to top-anchored while horizontal focus is preserved
- Gold theme:
  - applies gold gradient to the title accent
  - applies the same gradient to the primary CTA
- Standard theme:
  - title accent returns to plain text color
  - primary CTA returns to the white button style

## Glow and Border System
- Desktop only:
  - glow is rendered inside `.hero-banner-demo`
  - glow is sampled from the active media frame
  - overlay border remains the masked vertical gradient treatment
- Tablet and mobile:
  - no sampled glow
  - no border overlay

## Adoption Notes
- `hero-banner-data.json` is the content source for carousel mode
- `heroDemoConfig.js` remains the single-slide preview adapter for manual toggle mode
- The live settings panel is demo-only and should not be treated as production product UI
- The visual docs page is the preferred entry point for creative review
