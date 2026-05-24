"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Bubble {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  type: "colored" | "white"
}

function generateBubbles(count: number): Bubble[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 30 + Math.random() * 80,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * -12,
    type: Math.random() > 0.5 ? "colored" : "white",
  }))
}

export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    setBubbles(generateBubbles(8))
  }, [])

  return (
    <>
      <style>{`
        .bubble-float {
          position: fixed;
          bottom: -120px;
          animation: bubbleRise var(--dur) ease-in infinite var(--delay);
          pointer-events: none;
          z-index: 100;
        }
        @keyframes bubbleRise {
          0%   { transform: translateY(0) translateX(0px);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
        }
      `}</style>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble-float"
          style={{
            left: `${bubble.x}%`,
            width: bubble.size,
            height: bubble.size,
            "--dur": `${bubble.duration}s`,
            "--delay": `${bubble.delay}s`,
          } as React.CSSProperties}
        >
          <Image
            src={`/assets/stickers/${bubble.type === "colored" ? "colored-bubble" : "white-bubble"}.svg`}
            alt=""
            width={bubble.size}
            height={bubble.size}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ))}
    </>
  )
}