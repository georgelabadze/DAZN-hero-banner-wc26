# Creative Guide: DAZN React Hero Banner

## Core Creative Outputs
- Desktop master: `16:9`
- Tablet master: `1:1`
- Mobile master: `5:7`
- Each breakpoint can be delivered as a still or as a video using the same safe-space rules
- Recommended exports:
  - Desktop: `3840 x 2160`
  - Tablet: `2160 x 2160`
  - Mobile: `2160 x 3024`
- Do not bake live UI, runtime glow, or border treatment into the artwork

## Breakpoint Mapping
- Desktop creative is used at `1025px` and above
- Tablet creative is used from `768px` to `1024px`
- Mobile creative is used at `767px` and below
- Live motion assets should provide matching poster frames for each breakpoint

## Layout Intent
- Desktop remains a wide cinematic card with content anchored bottom-left
- Tablet and mobile are no longer full-bleed
- Tablet and mobile are inset cards that stay top-aligned and cap at `90svh`
- Hero width always follows the parent width inside the active gutters
- Tablet uses `1:1` as the target creative ratio and mobile uses `5:7` as the target creative ratio
- Once the live card hits its height cap, it crops vertically instead of locking the width
- The live content sits as a bottom overlay inside both cards

## Outer Gutters and Radius
- Desktop outside gutter: `64px`
- Tablet outside gutter: `32px`
- Mobile outside gutter: `16px`
- Desktop hero radius: `18px`
- Tablet and mobile hero radius: `14px`

## Art Direction Rules
- Desktop:
  - Keep the subject on the right half of the frame
  - Keep the lower-left copy zone darker and calmer
  - Motion should avoid rapid high-contrast changes directly behind the copy block
- Tablet:
  - Keep the subject centered in the upper-middle of the square frame
  - The lower half of the card still needs room for live copy, so avoid noisy detail there
  - Compose the square art to survive vertical crop when the live card hits the height cap
  - If using motion, keep the primary action in the upper-middle safe zone
- Mobile:
  - Keep the subject in the upper-middle of the `5:7` frame
  - Protect the lower card area for the live copy stack
  - Leave enough tolerance that a small amount of the lower creative can remain visible
  - Avoid bright highlights directly behind the CTA zone
  - Motion should still read clearly on the poster frame because posters are used during load and fallback

## Glow Guidance
- The hero glow is derived from the still image or current video frame at runtime
- Creative does not need a separate glow asset
- Strong atmospheric color near the upper and side regions of the artwork will improve the quality of the sampled glow
- Avoid flat monochrome plates if you want the glow to feel rich
- Video should keep usable color information across the sequence, not only in a single hero frame

## Border Guidance
- The live hero already carries a colored overlay border
- Do not try to mimic that border inside the artwork
- Artwork should stay clean and cinematic so the runtime border and glow can do their job

## Review Pass
1. Check desktop at `1440` and `1920`
2. Check tablet at `1024` and `768`
3. Check mobile at `767`, `390`, and `375`
4. Confirm the hero always resizes with the parent width inside the active gutters
5. Confirm the subject remains strong with the lower live copy zone active
6. Confirm the image still works when the title wraps to multiple lines
7. If using motion, confirm the poster frame and the moving sequence both hold up under the live copy
