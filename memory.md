# Aquabooth Project Memory

## Project Overview
- **Project name:** aqua-booth (folder: `aqua-booth`)
- **Tagline:** "Dive into the moment."
- **Branding:** aqua booth by nayadesigns
- **Path:** `C:\Users\chani\Documents\Dev-Projects\aqua-booth\aqua-booth`

---

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (no tailwind.config.ts — all config in globals.css via @theme)
- **Animations:** Framer Motion
- **Camera:** react-webcam
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/utilities
- **State:** Zustand
- **Toast:** react-hot-toast
- **Icons:** Remix Icons (via CDN in globals.css)
- **Fonts:** Positions (local .ttf) + Poppins (Google Fonts)
- **Deploy:** Vercel (planned)

## Installed Dependencies
```bash
npm install framer-motion react-webcam
npm install @dnd-kit/core @dnd-kit/utilities
npm install react-hot-toast
npm install react-use-measure
npm install zustand
npm install remixicon
```

---

## Design System

### Colors (in globals.css @theme)
```css
--color-amber-honey-50 to 900
--color-pacific-blue-50 to 950  ← PRIMARY: #1BA5B2
--color-parchment-50 to 950     ← BG: #F2EDEC
```

### Fonts
- **Display/Headings:** "Positions" → file: `public/fonts/PositionsByArixbored-Regular.ttf`
- **Body:** "Poppins" → Google Fonts
- **Fix note:** Font wasn't loading because filename had spaces. URL-encode spaces as %20 in @font-face src, OR rename file to remove spaces.

### globals.css structure (IMPORTANT — order matters):
```css
@import url("https://fonts.googleapis.com/css2?family=Poppins...");
@import url("https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css");
@import "tailwindcss";

@font-face { font-family: "Positions"; src: url("/fonts/PositionsByArixbored-Regular.ttf") format("truetype"); }

@theme {
  --color-amber-50: #FEF6E6; ... (all color tokens)
  --color-pacific-blue-500: #1BA5B2; ... etc
  --color-parchment-400: #F2EDEC; ... etc
  --font-display: "Positions", cursive;
  --font-body: "Poppins", sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background-color: #F2EDEC; font-family: "Poppins", sans-serif; }
```

---

## Asset Structure
```
public/
  assets/
    home/
      aquarium.gif          ← full aquarium scene (tank + fish + strip preview all in one GIF)
      sample-strip.png      ← sample strip preview shown on home (may be inside GIF now)
    frame/
      strip-frame.svg       ← the booth capture frame (SVG for quality)
      strip-frame.png       ← 1240x1748px export with transparent photo slots
    stickers/
      fish-orange.svg
      fish-pink.svg
      fish-purple.svg
      fish-yellow.svg
      fish-green.svg
      seahorse.svg
      shell.svg
      starfish.svg
      seaweed.svg
      colored-bubble.svg
      white-bubble.svg
      aquarium-tank.svg     ← home screen full card layout SVG (includes logo, nayadesigns, tank, strip slot)
  fonts/
    PositionsByArixbored-Regular.ttf
```

---

## Strip Frame Measurements (for canvas compositor in Screen C)
- **Frame size:** 1240 × 1748px
- **Photo Slot 1:** X: 85px, Y: 207.6px, W: 1070px, H: 690px
- **Photo Slot 2:** X: 86.6px, Y: 918.6px, W: 1070px, H: 690px
- **Canvas draw order:** photo1 → photo2 → frame PNG on top
```js
ctx.drawImage(photo1, 85, 207.6, 1070, 690)
ctx.drawImage(photo2, 86.6, 918.6, 1070, 690)
ctx.drawImage(frame, 0, 0, 1240, 1748)
```

---

## Slot Positions in BoothScreen (as % of frame SVG)
```ts
const SLOT1 = { top: "11.9%", left: "6.85%", width: "86.3%", height: "39.5%" }
const SLOT2 = { top: "52.6%", left: "6.95%", width: "86.3%", height: "39.5%" }
```

---

## File Structure
```
src/
  app/
    page.tsx                    ← Home screen ✅
    booth/
      page.tsx                  ← Capture screen ✅
    designer/
      page.tsx                  ← Strip designer (TODO)
  components/
    home/
      AnimatedFloor.tsx         ← ✅ DONE
      FloatingBubbles.tsx       ← ✅ DONE
      AquariumCard.tsx          ← ✅ DONE
    booth/
      BoothScreen.tsx           ← ✅ DONE (needs screenshot verification)
    designer/                   ← TODO
    shared/
      Button.tsx                ← ✅ DONE
  store/
    boothStore.ts               ← ✅ DONE
  hooks/                        ← empty, for future
  types/                        ← empty, for future
```

---

## Shared Button Component
- File: `src/components/shared/Button.tsx`
- Style: Neumorphic with pacific blue hover fill animation (from uiverse.io)
- Font: "Positions", cursive
- Icons: Remix Icons via `icon="ri-icon-name"` prop
- Props: `children, onClick, icon, type, className, disabled`
- Usage:
```tsx
<Button icon="ri-camera-line" onClick={fn}>Capture</Button>
<Button icon="ri-check-line" onClick={fn}>Ready</Button>
<Button icon="ri-delete-bin-line" onClick={fn}>Yes, Reset</Button>
```

---

## Screen A — Home (✅ COMPLETE)
**File:** `src/app/page.tsx`
```tsx
import AnimatedFloor from "@/components/home/AnimatedFloor"
import FloatingBubbles from "@/components/home/FloatingBubbles"
import AquariumCard from "@/components/home/AquariumCard"

export default function Home() {
  return (
    <main className="min-h-screen relative bg-amber-50">
      <AnimatedFloor />
      <FloatingBubbles />
      <AquariumCard />
    </main>
  )
}
```

### AnimatedFloor.tsx
- `position: fixed; bottom: 0` — full width perspective tiled floor
- Tiles shift between random pacific blue shades using CSS animation
- Each tile has random `--color-from`, `--color-to`, `--dur`, `--delay`

### FloatingBubbles.tsx
- 8 bubbles, mix of `colored-bubble.svg` and `white-bubble.svg`
- `position: fixed`, rise from bottom, fade out at top
- Random size (30–110px), speed, delay, x position

### AquariumCard.tsx
- Renders `aquarium.gif` as full card (tank + fish + strip all in GIF)
- Only code element: Start button overlaid at position `bottom: 15.4%, left: 24.5%`
- Start button uses shared Button component, navigates to `/booth`
- `maxWidth: 700`

---

## Screen B — Capture (✅ BUILT, needs verification)
**File:** `src/app/booth/page.tsx` → renders `BoothScreen.tsx`

### Flow:
1. Land on booth → Slot 1 active → webcam shows in slot 1
2. Click Capture → countdown 3-2-1 in center of active slot → photo taken → fills slot 1
3. Slot 2 becomes active → webcam shows in slot 2
4. Click Capture again → photo taken → fills slot 2
5. Hover any filled slot → trash icon appears → click to delete → that slot becomes active again
6. Both filled → Capture button becomes "Ready" → Upload Photos becomes "Reset"
7. Click Ready → navigate to `/designer`
8. Click Reset → modal appears → confirm → both photos deleted → reset to slot 1

### Upload Photos:
- Hidden file input, accepts `.jpg`, `.jpeg`, `.png` only
- Fills whichever slot is currently active

### Reset Modal:
- Framer Motion scale + fade animation
- Click outside to dismiss
- Confirm deletes both photos

### Key implementation notes:
- Frame SVG is `zIndex: 2` (on top)
- Slots are `zIndex: 1` (behind frame so sand shows over camera)
- Countdown renders at `zIndex: 3` (above frame)
- Flash effect on capture (white overlay fades out)
- Front camera default (`facingMode: "user"`)
- Back Home link sits ABOVE the frame, aligned to frame width (maxWidth: 380)
- Upload Photos has NO underline (text-decoration: none)

---

## Screen C — Strip Designer (TODO)
**Planned features:**
- Left: strip preview (canvas with photos + frame overlaid)
- Right: sticker panel (4x3 grid)
- Stickers: drag and drop onto strip
- Selected sticker shows bounding box with flip H / flip V toolbar above it
- Bubble sticker: random size on each click
- Other stickers: drag only, flip H/V
- Download button: `canvas.toDataURL()` exports final image
- After download: toast notification "Thanks for using Aquabooth!", state preserved
- Retake button: clears photos → back to `/booth`
- Back Home link: top left

### Sticker list (from /public/assets/stickers/):
- fish-orange, fish-pink, fish-purple, fish-yellow, fish-green
- seahorse, shell, starfish, seaweed
- colored-bubble, white-bubble (random size on click)
- Remove option in panel

### Canvas compositor:
```js
ctx.drawImage(photo1, 85, 207.6, 1070, 690)
ctx.drawImage(photo2, 86.6, 918.6, 1070, 690)
ctx.drawImage(frame, 0, 0, 1240, 1748)
// then draw all placed stickers on top
```

---

## Zustand Store
**File:** `src/store/boothStore.ts`
```ts
interface BoothStore {
  photos: [string | null, string | null]
  setPhoto: (slot: 0 | 1, photo: string) => void
  deletePhoto: (slot: 0 | 1) => void
  resetPhotos: () => void
}
```

---

## TODO / Pending Issues
1. **Screen C (Designer)** — not built yet, next major task
2. **Responsiveness** — noted to fix later for all screens:
   - Mobile: front camera default ✅ (already set)
   - Mobile: designer layout stacks vertically (strip on top, stickers below)
   - Bubbles too big on mobile
   - Card needs padding on mobile sides
   - Floor too tall on mobile
3. **BoothScreen** — needs screenshot verification after latest fixes:
   - Back Home above frame ✅
   - Upload Photos no underline ✅
   - Buttons below frame, not overlapping ✅
4. **sample-strip.png** — may no longer be needed if aquarium.gif includes strip preview

---

## Important Rules / Decisions Made
- Never recreate SVG assets in code — always use the actual asset files
- `aquarium-tank.svg` IS the entire home card layout (logo, tank, nayadesigns, strip slot all included)
- `strip-frame.svg` IS the booth frame — just render it, layer slots behind it
- All `@import` must be at top of globals.css before everything
- No Lottie — fish animated via GIF baked into aquarium.gif
- No styled-components — converted Button to plain CSS in JSX style tag
- Tailwind v4: use `@theme` block, no tailwind.config.ts
- Next.js Image with GIFs needs `unoptimized` prop
- All "use client" on any component using useState, useEffect, useRef, or browser APIs
