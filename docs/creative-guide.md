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

## Runtime Crop Behavior
- All hero media uses `object-fit: cover`
- On taller viewports the authored focus position is used as-is
- When the hero becomes height-constrained, horizontal focus is preserved and vertical crop becomes top-anchored
- In practice, the lower part of the artwork is what gets cropped first
- Keep critical subject matter in the upper or upper-middle part of the frame

## Desktop / Left-Aligned
- Ratio: `16:9`
- Crop-risk perimeter: outer `4%`
- Top breathing zone: `x 7–93%`, `y 5–16%`
- Key visual safe zone: `x 42–92%`, `y 10–78%`
- Copy-safe zone: `x 4–52%`, `y 50–94%`
- CTA + helper zone: `x 8–42%`, `y 78–91%`
- Layout notes:
  - Desktop remains an inset card
  - Desktop title reads at about `50%` width
  - Desktop subtitle and helper read at about `30%` width
  - On shorter desktop heights, the lower part of the artwork can crop first
- Art direction:
  - Keep the subject in the right or upper-right part of the frame
  - Keep the lower-left band tolerant of live copy and CTA overlap

## Desktop / Centered
- Ratio: `16:9`
- Crop-risk perimeter: outer `4%`
- Top breathing zone: `x 7–93%`, `y 5–16%`
- Key visual safe zone: `x 24–76%`, `y 10–68%`
- Copy-safe zone: `x 24–76%`, `y 54–94%`
- CTA + helper zone: `x 32–68%`, `y 78–91%`
- Layout notes:
  - Desktop remains an inset card
  - Desktop title reads at about `50%` width
  - Desktop subtitle and helper read at about `30%` width
  - On shorter desktop heights, the lower part of the artwork can crop first
- Art direction:
  - Keep the subject in the upper-middle of the frame
  - Leave the lower-center area tolerant of copy and CTA overlap

## Tablet
- Ratio: `5:7`
- Crop-risk perimeter: `6%` left/right/top, `12%` bottom
- Top breathing zone: `x 8–92%`, `y 6–16%`
- Key visual safe zone: `x 18–82%`, `y 12–60%`
- Copy-safe zone: `x 8–92%`, `y 68–92%`
- CTA + helper zone: `x 12–88%`, `y 78–90%`
- Layout notes:
  - Tablet stays full width and targets a true `5:7` frame
  - Tablet title reads at about `80%` width
  - Tablet subtitle and helper read at about `60%` width
  - Tablet prefers about `85%` of screen height in normal cases
  - On short or rotated screens, extra page scroll is expected instead of shrinking the hero too much
- Art direction:
  - Keep the strongest focal content in the upper and upper-middle part of the frame
  - Keep the top band calm enough for the overlaid header

## Mobile
- Ratio: `9:16`
- Crop-risk perimeter: `6%` left/right, `8%` top, `14%` bottom
- Top breathing zone: `x 8–92%`, `y 5–15%`
- Key visual safe zone: `x 18–82%`, `y 10–56%`
- Copy-safe zone: `x 8–92%`, `y 64–90%`
- CTA + helper zone: `x 12–88%`, `y 76–88%`
- Layout notes:
  - Mobile is full-bleed and full-screen in normal cases
  - Mobile keeps the current centered text widths
  - Mobile prefers about `90%` of screen height in normal cases
  - On short or rotated screens, extra page scroll is expected instead of shrinking the hero too much
- Art direction:
  - Keep the subject in the upper or upper-middle part of the frame
  - Avoid bright or high-detail elements behind the lower content stack

## Review Pass
1. Check desktop at `1728`, `1440`, and `1280`
2. Check tablet at `1024`, `900`, and `768`
3. Check mobile at `430`, `390`, and `375`
4. Confirm the key visual stays inside the stated safe zone for each breakpoint
5. Confirm lower bands still tolerate live title, subtitle, CTA, and optional helper text
6. Confirm the top of the artwork stays calm enough for the header treatment
7. If using motion, confirm both the poster frame and the moving sequence hold up under the live crop behavior
