"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Button from "@/components/shared/Button"

const FISH = [
  { src: "orange-fish.svg", left: "32%", top: "18%", width: "13%", duration: 6,   delay: 0,  scaleX: 1  },
  { src: "green-fish.svg",  left: "8%",  top: "40%", width: "9%",  duration: 7,   delay: -2, scaleX: -1 },
  { src: "pink-fish.svg",   left: "38%", top: "60%", width: "9%",  duration: 8,   delay: -1, scaleX: 1  },
  { src: "yellow-fish.svg", left: "18%", top: "63%", width: "10%", duration: 6.5, delay: -3, scaleX: 1  },
  { src: "purple-fish.svg", left: "42%", top: "35%", width: "8%",  duration: 9,   delay: -4, scaleX: -1 },
  { src: "seahorse.svg",    left: "48%", top: "20%", width: "7%",  duration: 4,   delay: -1, scaleX: 1  },
]

export default function AquariumCard() {
  return (
    <>
      <style>{`
        @keyframes fishSwim {
          0%,100% { transform: translateX(0px) translateY(0px); }
          25%      { transform: translateX(18px) translateY(-8px); }
          75%      { transform: translateX(-18px) translateY(8px); }
        }
        @keyframes seahorseBob {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        .fish-anim {
          position: absolute;
          animation: fishSwim var(--dur) ease-in-out infinite var(--delay);
        }
        .seahorse-anim {
          position: absolute;
          animation: seahorseBob var(--dur) ease-in-out infinite var(--delay);
        }
      `}</style>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative" style={{ maxWidth: 700, width: "100%" }}>

          {/* SVG is the entire card layout */}
          <Image
            src="/assets/home/aquarium-tank.svg"
            alt="Aquabooth"
            width={900}
            height={600}
            style={{ width: "100%", height: "auto" }}
            priority
          />

          {/* Fish layered on top — all within left tank area (0-60% width) */}
          {FISH.map((fish, i) => (
            <div
              key={i}
              className={fish.src === "seahorse.svg" ? "seahorse-anim" : "fish-anim"}
              style={{
                left: fish.left,
                top: fish.top,
                width: fish.width,
                "--dur": `${fish.duration}s`,
                "--delay": `${fish.delay}s`,
              } as React.CSSProperties}
            >
              <Image
                src={`/assets/stickers/${fish.src}`}
                alt=""
                width={80}
                height={80}
                style={{ width: "100%", height: "auto", transform: `scaleX(${fish.scaleX})` }}
              />
            </div>
          ))}

          {/* Strip preview — right panel of the SVG is roughly 65-90% from left */}
          <motion.div
            animate={{ y: [30, 0, 0, 30] }}
            transition={{ duration: 4, times: [0, 0.3, 0.7, 1], repeat: Infinity, repeatDelay: 1 }}
            style={{ position: "absolute", bottom: "14%", right: "8%", width: "14%" }}
          >
            <Image
              src="/assets/home/sample-strip.png"
              alt="Sample strip"
              width={120}
              height={200}
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </motion.div>

          {/* Start button — centered under the tank (left tank = ~60% of card) */}
          <div style={{ 
            position: "absolute", 
            bottom: "3%", 
            left: "30%", 
            transform: "translateX(-50%)" 
          }}>
            <Button icon="ri-login-box-line">Start</Button>
          </div>

        </div>
      </div>
    </>
  )
}