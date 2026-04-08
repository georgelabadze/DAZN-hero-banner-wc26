# Developer Guide: DAZN React Hero Banner

## Stack
- Vite + React
- Multi-page build: `index.html` for the live demo and `documentation.html` for the visual guideline page
- Runtime glow sampling implemented in React with `ResizeObserver` and canvas-based still/video frame sampling

## Main Files
- `src/App.jsx`: wires the page shell, header, and hero data
- `src/components/Header.jsx`: DAZN header component
- `src/components/HeroBanner.jsx`: responsive hero component with breakpoint logic and width-first card sizing
- `src/hooks/useHeroGlow.js`: runtime glow palette sampling and glow geometry measurement
- `styles.css`: live app styling
- `vite.config.js`: multi-page Vite build entrypoints

## Public Component Contract
### `Header`
- `logoSrc: string`
- `actions: { label: string; variant: "secondary" | "primary"; href?: string }[]`

### `HeroBanner`
- `media: { desktop: MediaItem; tablet: MediaItem; mobile: MediaItem }`
- `MediaItem = { kind: "image" | "video"; src: string; poster?: string; alt?: string }`
- `copy: { label: string; title: string; subtitle: string; price: string; helperText: string }`
- `cta: { label: string; href: string }`
- `focus?: { desktop?: string; tablet?: string; mobile?: string }`
- `alt: string`
- Backward compatibility: if `media` is not provided, legacy `images` input is normalized to image items

## Breakpoints and Layout Rules
- Desktop: `1025px` and above
  - Hero stays cinematic and overlay-based
  - Desktop art uses the existing wide composition
  - Card width always follows the parent
  - `16:9` is the target ratio until the desktop height cap is hit
  - After the cap, the card crops vertically instead of shrinking horizontally
  - Outer gutter is `64px`
  - Hero radius is `18px`
- Tablet: `768px` to `1024px`
  - Hero becomes an inset card capped by `90svh`
  - Card width always follows the parent
  - `1:1` is the target creative ratio until the height cap is hit
  - After the cap, the card crops vertically instead of shrinking horizontally
  - Content stays bottom-aligned as an overlay layer
  - Outer gutter is `32px`
  - Hero radius is `14px`
- Mobile: `767px` and below
  - Hero remains inset and top-aligned
  - Card width always follows the parent
  - `5:7` is the target creative ratio until the height cap is hit
  - After the cap, the card crops vertically instead of shrinking horizontally
  - Content stays bottom-aligned as an overlay layer
  - Outer gutter is `16px`
  - Hero radius is `14px`

## Header Rules
- Header height is fixed at `64px`
- Logo is `32 x 32`
- Buttons are `72 x 40`
- Button gap is `16px`
- Explore button: `#3d4549` background, white text
- Log in button: white background, black text
- Header and hero share the same outer gutter tokens at every breakpoint

## Glow System
- Glow is rendered inside `.hero-demo` only
- Glow is centered on the live hero card, not the viewport
- Card bounds are measured with `ResizeObserver`
- Glow geometry is clamped to the hero wrapper so it never expands layout width
- The active media is sampled in four regions:
  - top-center
  - left-middle
  - right-middle
  - lower-middle
- Images are sampled once after load/decode
- Videos are sampled from live frames at roughly `6-8fps` using `requestVideoFrameCallback` with a timer fallback
- Poster art is used as the first glow state and as the failure fallback for video
- Sampled colors are written to CSS custom properties and rendered through blurred radial gradients
- Fallback glow colors are kept in the hook for first paint and failure cases

## Video Behavior
- Hero videos autoplay muted, loop, and play inline
- `preload="metadata"` is used to avoid heavy eager loading
- Videos render with poster images so the hero has a stable first frame and a graceful fallback path
- The same breakpoint crop and focus rules apply to image and video media

## Border System
- Base border: `1px solid rgba(255, 255, 255, 0.1)`
- Overlay border: masked vertical gradient on top of the base border
- Gradient stops:
  - `0%`: `rgba(255, 255, 255, 0)`
  - `30%`: `rgba(255, 250, 0, 0.6)`
  - `50%`: `rgba(255, 170, 0, 0.4)`
  - `70%`: `rgba(100, 252, 220, 0.2)`
  - `100%`: `rgba(255, 255, 255, 0)`

## QA Checklist
- Confirm the Vite build succeeds
- Confirm desktop/tablet/mobile use the correct video asset with the correct poster fallback
- Confirm videos autoplay muted, loop, stay inline, and expose no controls
- Confirm the header and hero are top-aligned at all breakpoints
- Confirm outer gutters resolve to `64 / 32 / 16`
- Confirm header and hero widths continuously shrink with the parent and never plateau before the next breakpoint
- Confirm desktop keeps the current wide feel
- Confirm desktop uses a slight upward crop bias once the height cap is hit
- Confirm tablet and mobile hero cards never exceed `90svh`
- Confirm tablet and mobile keep a small visible bottom strip under the default crop bias
- Confirm the glow stays inside `.hero-demo`, follows the live hero card, and updates from stills and video frames
- Confirm the layered border shows both the white base line and the masked color border
- Check `1920`, `1440`, `1024`, `768`, `767`, `430`, `390`, and `375`
