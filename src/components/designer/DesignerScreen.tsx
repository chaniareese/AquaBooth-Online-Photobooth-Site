"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useBoothStore } from "@/store/boothStore"
import { useRouter } from "next/navigation"
import Button from "@/components/shared/Button"
import toast, { Toaster } from "react-hot-toast"

const FRAME_W = 1240
const FRAME_H = 1748
const SLOT1 = { x: 85,   y: 207.6, w: 1070, h: 690 }
const SLOT2 = { x: 86.6, y: 918.6, w: 1070, h: 690 }

const STICKERS = [
  { id: "fish-orange",  src: "/assets/stickers/fish-orange.svg",    defaultSize: 60 },
  { id: "fish-pink",    src: "/assets/stickers/fish-pink.svg",      defaultSize: 50 },
  { id: "fish-purple",  src: "/assets/stickers/fish-purple.svg",    defaultSize: 50 },
  { id: "fish-yellow",  src: "/assets/stickers/fish-yellow.svg",    defaultSize: 55 },
  { id: "fish-green",   src: "/assets/stickers/fish-green.svg",     defaultSize: 55 },
  { id: "seahorse",     src: "/assets/stickers/seahorse.svg",       defaultSize: 60 },
  { id: "shell",        src: "/assets/stickers/shell.svg",          defaultSize: 60 },
  { id: "starfish",     src: "/assets/stickers/starfish.svg",       defaultSize: 55 },
  { id: "seaweed",      src: "/assets/stickers/seaweed.svg",        defaultSize: 100 },
  { id: "bubble-white", src: "/assets/stickers/white-bubble.svg",   defaultSize: 0 },
  { id: "bubble-color", src: "/assets/stickers/colored-bubble.svg", defaultSize: 0 },
  { id: "remove",       src: "",                                     defaultSize: 0 },
]

const BUBBLE_IDS = ["bubble-white", "bubble-color"]

interface PlacedSticker {
  uid: string
  src: string
  x: number
  y: number
  size: number
  flipH: boolean
}

export default function DesignerScreen() {
  const router = useRouter()
  const { photos, resetPhotos } = useBoothStore()
  const stripRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [stickers, setStickers] = useState<PlacedSticker[]>([])
  const [selectedUid, setSelectedUid] = useState<string | null>(null)
  const [draggingUid, setDraggingUid] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const getStripBounds = () => stripRef.current?.getBoundingClientRect() ?? null

  const handleAddSticker = (sticker: typeof STICKERS[0]) => {
    const isBubble = BUBBLE_IDS.includes(sticker.id)
    const size = isBubble
      ? 25 + Math.random() * 35
      : sticker.defaultSize
    const newSticker: PlacedSticker = {
      uid: `${sticker.id}-${Date.now()}`,
      src: sticker.src,
      x: 30 + Math.random() * 30,
      y: 20 + Math.random() * 30,
      size,
      flipH: false,
    }
    setStickers((prev) => [...prev, newSticker])
    setSelectedUid(newSticker.uid)
  }

  const handleFlip = (uid: string) => {
    setStickers((prev) =>
      prev.map((s) => s.uid === uid ? { ...s, flipH: !s.flipH } : s)
    )
  }

  const handleDelete = (uid: string) => {
    setStickers((prev) => prev.filter((s) => s.uid !== uid))
    setSelectedUid(null)
  }

  const handleDragStart = (e: React.PointerEvent, uid: string) => {
    e.stopPropagation()
    setSelectedUid(uid)
    setDraggingUid(uid)
    const bounds = getStripBounds()
    if (!bounds) return
    const sticker = stickers.find((s) => s.uid === uid)
    if (!sticker) return
    const stickerX = (sticker.x / 100) * bounds.width
    const stickerY = (sticker.y / 100) * bounds.height
    setDragOffset({
      x: e.clientX - bounds.left - stickerX,
      y: e.clientY - bounds.top - stickerY,
    })
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handleDragMove = (e: React.PointerEvent, uid: string) => {
    if (draggingUid !== uid) return
    const bounds = getStripBounds()
    if (!bounds) return
    const rawX = e.clientX - bounds.left - dragOffset.x
    const rawY = e.clientY - bounds.top - dragOffset.y
    const xPct = Math.max(0, Math.min(100, (rawX / bounds.width) * 100))
    const yPct = Math.max(0, Math.min(100, (rawY / bounds.height) * 100))
    setStickers((prev) =>
      prev.map((s) => s.uid === uid ? { ...s, x: xPct, y: yPct } : s)
    )
  }

  const handleDragEnd = () => setDraggingUid(null)

  const handleDownload = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = FRAME_W
    canvas.height = FRAME_H
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((res, rej) => {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.onload = () => res(img)
        img.onerror = rej
        img.src = src
      })

    try {
      if (photos[0]) {
        const img = await loadImage(photos[0])
        ctx.save()
        ctx.beginPath()
        ctx.rect(SLOT1.x, SLOT1.y, SLOT1.w, SLOT1.h)
        ctx.clip()
        const scale = Math.max(SLOT1.w / img.naturalWidth, SLOT1.h / img.naturalHeight)
        const sw = img.naturalWidth * scale
        const sh = img.naturalHeight * scale
        const sx = SLOT1.x + (SLOT1.w - sw) / 2
        const sy = SLOT1.y + (SLOT1.h - sh) / 2
        ctx.drawImage(img, sx, sy, sw, sh)
        ctx.restore()
      }

      if (photos[1]) {
        const img = await loadImage(photos[1])
        ctx.save()
        ctx.beginPath()
        ctx.rect(SLOT2.x, SLOT2.y, SLOT2.w, SLOT2.h)
        ctx.clip()
        const scale = Math.max(SLOT2.w / img.naturalWidth, SLOT2.h / img.naturalHeight)
        const sw = img.naturalWidth * scale
        const sh = img.naturalHeight * scale
        const sx = SLOT2.x + (SLOT2.w - sw) / 2
        const sy = SLOT2.y + (SLOT2.h - sh) / 2
        ctx.drawImage(img, sx, sy, sw, sh)
        ctx.restore()
      }

      const frame = await loadImage("/assets/frame/strip-frame.png")
      ctx.drawImage(frame, 0, 0, FRAME_W, FRAME_H)

      const stripBounds = getStripBounds()
      const stripRenderedW = stripBounds?.width ?? 520
      const scaleToFrame = FRAME_W / stripRenderedW

      for (const sticker of stickers) {
        const img = await loadImage(sticker.src)
        const sizeInFrame = sticker.size * scaleToFrame
        const xInFrame = (sticker.x / 100) * FRAME_W
        const yInFrame = (sticker.y / 100) * FRAME_H
        ctx.save()
        ctx.translate(xInFrame + sizeInFrame / 2, yInFrame + sizeInFrame / 2)
        if (sticker.flipH) ctx.scale(-1, 1)
        ctx.drawImage(img, -sizeInFrame / 2, -sizeInFrame / 2, sizeInFrame, sizeInFrame)
        ctx.restore()
      }

      const link = document.createElement("a")
      link.download = "aquabooth-strip.png"
      link.href = canvas.toDataURL("image/png")
      link.click()

      toast("Thanks for using Aquabooth! 🐠", {
        style: {
          fontFamily: "Positions, cursive",
          background: "#EFE9E7",
          color: "#1BA5B2",
          border: "1px solid #1BA5B2",
        },
      })
    } catch (err) {
      console.error("Download failed:", err)
      toast.error("Something went wrong. Please try again.")
    }
  }, [photos, stickers])

  const handleRetake = () => {
    resetPhotos()
    router.push("/booth")
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <style>{`
        .sticker-grid-item {
          aspect-ratio: 1;
          background: #E9F6F8;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          padding: 8px;
        }
        .sticker-grid-item:not(.remove-btn):hover {
          background: #1BA5B2;
          transform: scale(1.05);
        }
        .sticker-grid-item img {
          width: 36px !important;
          height: 36px !important;
          filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.20));
        }
        .sticker-grid-item:not(.remove-btn):hover img {
          filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.20)) brightness(1.1);
        }
        .remove-btn {
          background: #E9F6F8;
          flex-direction: column;
          gap: 4px;
        }
        .remove-btn:hover {
          background: #FEF6E6 !important;
          transform: scale(1.05);
        }
        .remove-btn:hover .remove-icon {
          color: #ECA400 !important;
        }
        .remove-btn:hover .remove-label {
          color: #ECA400 !important;
        }
        .bounding-box {
          position: absolute;
          border: 2px dashed #1BA5B2;
          pointer-events: none;
          inset: -4px;
        }
        .bounding-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          background: white;
          border: 2px solid #1BA5B2;
        }
        .toolbar-btn {
          background: white;
          border: 1.5px solid #BFBAB9;
          border-radius: 0;
          padding: 4px 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #1BA5B2;
          transition: background 0.15s;
        }
        .toolbar-btn:hover { background: #E9F6F8; }
        .retake-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: "Positions", cursive;
          color: #1BA5B2;
          font-size: 18px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-decoration: none;
        }
        .retake-link:hover { opacity: 0.75; }
      `}</style>

      <main className="min-h-screen bg-parchment-400 relative">

        <Link
          href="/"
          style={{
            position: "fixed", top: 20, left: 20, zIndex: 40,
            fontFamily: "Positions, cursive", color: "#1BA5B2", fontSize: 18,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <i className="ri-arrow-left-line" />
          Back Home
        </Link>

        <div className="flex items-center justify-center min-h-screen px-6 gap-10">

          {/* LEFT — Strip preview */}
          <div
            ref={stripRef}
            className="relative flex-shrink-0"
            style={{ width: 520, userSelect: "none" }}
            onPointerDown={() => setSelectedUid(null)}
          >
            {photos[0] && (
              <div style={{
                position: "absolute",
                top: "11.9%", left: "6.85%", width: "86.3%", height: "39.5%",
                zIndex: 1, overflow: "hidden"
              }}>
                <Image src={photos[0]} alt="Photo 1" fill style={{ objectFit: "cover" }} />
              </div>
            )}

            {photos[1] && (
              <div style={{
                position: "absolute",
                top: "52.6%", left: "6.95%", width: "86.3%", height: "39.5%",
                zIndex: 1, overflow: "hidden"
              }}>
                <Image src={photos[1]} alt="Photo 2" fill style={{ objectFit: "cover" }} />
              </div>
            )}

            <Image
              src="/assets/frame/strip-frame.svg"
              alt="Strip frame"
              width={1240}
              height={1748}
              style={{ width: "100%", height: "auto", position: "relative", zIndex: 2, pointerEvents: "none" }}
            />

            {stickers.map((sticker) => {
              const isSelected = selectedUid === sticker.uid
              return (
                <div
                  key={sticker.uid}
                  style={{
                    position: "absolute",
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    width: sticker.size,
                    height: sticker.size,
                    zIndex: 10,
                    cursor: draggingUid === sticker.uid ? "grabbing" : "grab",
                  }}
                  onPointerDown={(e) => handleDragStart(e, sticker.uid)}
                  onPointerMove={(e) => handleDragMove(e, sticker.uid)}
                  onPointerUp={handleDragEnd}
                  onClick={(e) => { e.stopPropagation(); setSelectedUid(sticker.uid) }}
                >
                  <Image
                    src={sticker.src}
                    alt=""
                    width={sticker.size}
                    height={sticker.size}
                    style={{
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      transform: sticker.flipH ? "scaleX(-1)" : "none",
                    }}
                  />

                  {isSelected && (
                    <>
                      <div className="bounding-box">
                        <div className="bounding-corner" style={{ top: -4, left: -4 }} />
                        <div className="bounding-corner" style={{ top: -4, right: -4 }} />
                        <div className="bounding-corner" style={{ bottom: -4, left: -4 }} />
                        <div className="bounding-corner" style={{ bottom: -4, right: -4 }} />
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          display: "flex",
                          gap: 6,
                          zIndex: 20,
                          pointerEvents: "all",
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <button
                          className="toolbar-btn"
                          onClick={(e) => { e.stopPropagation(); handleFlip(sticker.uid) }}
                          title="Flip"
                        >
                          <i className="ri-flip-horizontal-line" />
                        </button>
                        <button
                          className="toolbar-btn"
                          onClick={(e) => { e.stopPropagation(); handleDelete(sticker.uid) }}
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line" style={{ color: "#E05252" }} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* RIGHT — Sticker panel */}
          <div style={{ width: 340 }}>
            <h2 style={{
              fontFamily: "Positions, cursive",
              color: "#1BA5B2",
              fontSize: 28,
              lineHeight: 1.3,
              marginBottom: 8,
              textAlign: "center"
            }}>
              Add Stickers to<br />your Photo!
            </h2>
            <p style={{
              fontFamily: "Poppins, sans-serif",
              color: "#8F8C8B",
              fontSize: 13,
              textAlign: "center",
              marginBottom: 20
            }}>
              Move and place them anywhere in your photo
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 6,
              marginBottom: 28
            }}>
              {STICKERS.map((sticker) => {
                if (sticker.id === "remove") {
                  return (
                    <div
                      key="remove"
                      className="sticker-grid-item remove-btn"
                      onClick={() => {
                        setStickers([])
                        setSelectedUid(null)
                      }}
                    >
                      <i
                        className="ri-eraser-line remove-icon"
                        style={{ fontSize: 24, color: "#1BA5B2" }}
                      />
                      <span
                        className="remove-label"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 10,
                          color: "#1BA5B2"
                        }}
                      >
                        Remove All
                      </span>
                    </div>
                  )
                }

                return (
                  <div
                    key={sticker.id}
                    className="sticker-grid-item"
                    onClick={() => handleAddSticker(sticker)}
                  >
                    <Image
                      src={sticker.src}
                      alt={sticker.id}
                      width={52}
                      height={52}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                )
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <Button icon="ri-download-line" onClick={handleDownload}>
                Download
              </Button>
              <button className="retake-link" onClick={handleRetake}>
                <i className="ri-refresh-line" />
                Retake Photos
              </button>
            </div>
          </div>

        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </main>
    </>
  )
}