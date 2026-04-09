# Creative Guide: DAZN React Hero Banner

## Core Creative Outputs
- Desktop master: `16:9`
- Tablet master: `5:7`
- Mobile master: `9:16`
- Each breakpoint can be delivered as a still or as a video using the same safe-space rules
- Recommended exports:
  - Desktop: `3840 x 2160`
  - Tablet: `2160 x 3024`
  - Mobile: `2160 x 3840`
- Do not bake live UI into the artwork

## Breakpoint Mapping
- Desktop creative is used at `1025px` and above
- Tablet creative is used from `768px` to `1024px`
- Mobile creative is used at `767px` and below
- Live motion assets should provide matching poster frames for each breakpoint

## Layout Intent
- Desktop remains an inset cinematic card inside the shell gutters
- Desktop content sits as a bottom overlay and still caps against the viewport after the `64px` header
- Desktop title should comfortably support a live measure of about `40%` of the hero width
- Desktop subtitle and helper text should comfortably support a live measure of about `30%` of the hero width
- Tablet now stays full width while preserving a true `5:7` frame, while mobile remains a full-bleed, full-screen hero section
- Tablet and mobile no longer use card border, radius, or glow chrome
- On tablet and mobile the header sits over the creative from first paint, so the top of the artwork needs a calm protected band
- Tablet title should comfortably support a live measure of about `80%` of the hero width
- Tablet subtitle and helper text should comfortably support a live measure of about `60%` of the hero width
- Tablet and mobile both cap the live hero at about `85%` of the viewport so the next section remains visible underneath
- Mobile keeps the current centered text width behavior, so the creative should still leave a generous lower band for copy
- Live crop now keeps the full focus position on taller viewports, but once the hero becomes height-constrained it preserves horizontal framing and lets the lower edge of the artwork get cropped first

## Safe-Zone Direction
- Desktop:
  - Keep the main subject on the right side or high enough that the lower content zone stays clear
  - Preserve the top breathing zone under the header
  - Allow the lower content-safe band to hold title, subtitle, CTA row, and optional helper text
- Tablet:
  - Build for a vertical `5:7` composition
  - Keep the strongest focal content in the upper and upper-middle part of the frame
  - Leave the top portion calm enough for the overlaid header and top scrim
  - Protect the lower centered content band for title, subtitle, CTA, and optional helper text
- Mobile:
  - Build for a vertical `9:16` composition
  - Keep the focal subject in the upper and upper-middle part of the frame
  - Avoid bright or high-detail elements directly behind the lower CTA and helper area
  - Leave enough tolerance that the live hero can still keep a small visible peek of the next section below

## Motion and Posters
- Provide a matching poster for every motion asset
- Posters should read as finished key art because they are visible during load and fallback
- Motion should avoid rapid high-contrast changes directly behind the live copy stack
- On tablet and mobile, keep the top area especially stable because the header overlays the creative there

## Runtime Chrome
- Desktop still carries the sampled runtime glow and overlay border treatment
- Tablet and mobile intentionally do not
- Artwork should stay clean and cinematic so the desktop runtime chrome can add atmosphere without being duplicated in the asset itself

## Review Pass
1. Check desktop at `1728`, `1440`, and `1280`
2. Check tablet at `1024`, `900`, and `768`
3. Check mobile at `430`, `390`, and `375`
4. Confirm the desktop text still reads cleanly inside the narrower title and subtitle measures
5. Confirm tablet keeps its full-width `5:7` shape cleanly and that tablet/mobile still leave the next section visibly underneath
6. Confirm the top of the artwork stays calm enough for the overlaid small-screen header
7. If using motion, confirm the poster frame and the moving sequence both hold up under the live copy
