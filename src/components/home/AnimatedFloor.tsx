"use client"

import { useEffect, useRef } from "react"

const PACIFIC_BLUE_SHADES = [
  "#E9F6F8", // 50
  "#D1EDF0", // 100
  "#A4DBE0", // 200
  "#76C9D1", // 300
  "#49B7C1", // 400
  "#1BA5B2", // 500
]

export default function AnimatedFloor() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const cols = 12
    const rows = 8

    for (let i = 0; i < cols * rows; i++) {
      const tile = document.createElement("div")
      tile.className = "floor-tile"

      const fromIdx = Math.floor(Math.random() * PACIFIC_BLUE_SHADES.length)
      let toIdx = Math.floor(Math.random() * PACIFIC_BLUE_SHADES.length)
      if (toIdx === fromIdx) toIdx = (toIdx + 1) % PACIFIC_BLUE_SHADES.length

      const dur = (3 + Math.random() * 4).toFixed(2)
      const delay = (Math.random() * -6).toFixed(2)

      tile.style.cssText = `
        --color-from: ${PACIFIC_BLUE_SHADES[fromIdx]};
        --color-to: ${PACIFIC_BLUE_SHADES[toIdx]};
        --dur: ${dur}s;
        --delay: ${delay}s;
      `
      el.appendChild(tile)
    }
  }, [])

  return (
    <>
      <style>{`
        .floor-wrapper {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 45%;
          overflow: hidden;
        }
        .floor-surface {
          position: absolute;
          bottom: 0;
          left: -30%;
          width: 160%;
          height: 100%;
          transform: perspective(800px) rotateX(50deg);
          transform-origin: 50% 100%;
        }
        .floor-grid {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(8, 1fr);
          gap: 2px;
          background: #3AABB5;
          padding: 2px;
        }
        .floor-tile {
          background: var(--color-from);
          animation: tileShift var(--dur) ease-in-out infinite var(--delay);
        }
        @keyframes tileShift {
          0%, 100% { background-color: var(--color-from); }
          50%      { background-color: var(--color-to); }
        }
      `}</style>
      <div className="floor-wrapper">
        <div className="floor-surface">
          <div ref={gridRef} className="floor-grid" />
        </div>
      </div>
    </>
  )
}