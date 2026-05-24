"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Webcam from "react-webcam"
import { motion, AnimatePresence } from "framer-motion"
import { useBoothStore } from "@/store/boothStore"
import { useRouter } from "next/navigation"
import Button from "@/components/shared/Button"
import FloatingBubbles from "@/components/home/FloatingBubbles"

const SLOT1 = { top: "11.9%", left: "6.85%", width: "86.3%", height: "39.5%" }
const SLOT2 = { top: "52.6%", left: "6.95%", width: "86.3%", height: "39.5%" }

export default function BoothScreen() {
  const router = useRouter()
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { photos, setPhoto, deletePhoto, resetPhotos } = useBoothStore()
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [hoveredSlot, setHoveredSlot] = useState<0 | 1 | null>(null)
  const [flashSlot, setFlashSlot] = useState<0 | 1 | null>(null)

  const bothFilled = photos[0] !== null && photos[1] !== null

  useEffect(() => {
    if (photos[0] !== null && photos[1] === null) setActiveSlot(1)
    if (photos[0] === null && photos[1] !== null) setActiveSlot(0)
    if (photos[0] === null && photos[1] === null) setActiveSlot(0)
  }, [photos])

  const runCountdown = useCallback(() => {
    return new Promise<void>((resolve) => {
      let count = 3
      setCountdown(count)
      const interval = setInterval(() => {
        count--
        if (count === 0) {
          clearInterval(interval)
          setCountdown(null)
          resolve()
        } else {
          setCountdown(count)
        }
      }, 1000)
    })
  }, [])

  const handleCapture = useCallback(async () => {
    if (isCapturing || bothFilled) return
    setIsCapturing(true)
    await runCountdown()
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setFlashSlot(activeSlot)
      setTimeout(() => setFlashSlot(null), 300)
      setPhoto(activeSlot, imageSrc)
    }
    setIsCapturing(false)
  }, [isCapturing, bothFilled, activeSlot, runCountdown, setPhoto])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowed.includes(file.type)) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setPhoto(activeSlot, result)
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleDelete = (slot: 0 | 1) => {
    deletePhoto(slot)
    setActiveSlot(slot)
  }

  const handleReset = () => {
    resetPhotos()
    setShowResetModal(false)
    setActiveSlot(0)
  }

  const handleReady = () => {
    router.push("/designer")
  }

  return (
    <>
      <style>{`
        .slot-delete-btn {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.5);
          cursor: pointer;
          border-radius: 4px;
          z-index: 5;
        }
        .slot-wrapper:hover .slot-delete-btn { opacity: 1; }
        .flash-overlay {
          position: absolute;
          inset: 0;
          background: white;
          border-radius: 4px;
          pointer-events: none;
        }
        .booth-btn {
          font-size: 20px !important;
          padding: 0.5em 1.4em !important;
        }
        .upload-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: "Positions", cursive;
          color: #1BA5B2;
          font-size: 20px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-decoration: none;
        }
        .upload-link:hover { opacity: 0.75; }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .modal-box {
          background: #EFE9E7;
          border-radius: 0;
          border: 2px solid #BFBAB9;
          padding: 32px;
          max-width: 460px;
          width: 90%;
          text-align: center;
          font-family: "Poppins", sans-serif;
        }
      `}</style>

      <main className="min-h-screen relative bg-parchment-500">
        <FloatingBubbles />

        {/* Back Home — fixed top-left */}
        <Link
          href="/"
          className="flex items-center gap-2"
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 40,
            fontFamily: "Positions, cursive",
            color: "#1BA5B2",
            fontSize: 18,
            fontWeight: 500
          }}
        >
          <i className="ri-arrow-left-line" />
          Back Home
        </Link>

        <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-1">

          {/* Frame container */}
          <div className="relative" style={{ maxWidth: 420, width: "100%" }}>

            {/* Frame SVG on top */}
            <Image
              src="/assets/frame/strip-frame.svg"
              alt="Booth frame"
              width={1240}
              height={1748}
              style={{ width: "100%", height: "auto", position: "relative", zIndex: 2, boxShadow: "0 0 0 1px #BFBAB9", pointerEvents: "none" }}
              priority
            />

            {/* SLOT 1 */}
            <div
              className="slot-wrapper absolute overflow-hidden"
              style={{ ...SLOT1, position: "absolute", zIndex: 1 }}
              onMouseEnter={() => setHoveredSlot(0)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              {photos[0] ? (
                <>
                  <Image src={photos[0]} alt="Photo 1" fill style={{ objectFit: "cover" }} />
                  {hoveredSlot === 0 && (
                    <div 
                      className="slot-delete-btn" 
                      onClick={() => handleDelete(0)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.5)",
                        cursor: "pointer",
                        zIndex: 5
                      }}
                    >
                      <i className="ri-delete-bin-line" style={{ fontSize: 32, color: "#EFE9E7" }} />
                    </div>
                  )}
                </>
              ) : activeSlot === 0 ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  mirrored
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}

              <AnimatePresence>
                {activeSlot === 0 && countdown !== null && (
                  <motion.div
                    key={countdown}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "Positions, cursive",
                      fontSize: 80, color: "#1BA5B2",
                      textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      zIndex: 3
                    }}
                  >
                    {countdown}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {flashSlot === 0 && (
                  <motion.div
                    className="flash-overlay"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* SLOT 2 */}
            <div
              className="slot-wrapper absolute overflow-hidden"
              style={{ ...SLOT2, position: "absolute", zIndex: 1 }}
              onMouseEnter={() => setHoveredSlot(1)}
              onMouseLeave={() => setHoveredSlot(null)}
            >
              {photos[1] ? (
                <>
                  <Image src={photos[1]} alt="Photo 2" fill style={{ objectFit: "cover" }} />
                  {hoveredSlot === 1 && (
                    <div 
                      className="slot-delete-btn" 
                      onClick={() => handleDelete(1)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.5)",
                        cursor: "pointer",
                        zIndex: 5
                      }}
                    >
                      <i className="ri-delete-bin-line" style={{ fontSize: 32, color: "#EFE9E7" }} />
                    </div>
                  )}
                </>
              ) : activeSlot === 1 ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  mirrored
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}

              <AnimatePresence>
                {activeSlot === 1 && countdown !== null && (
                  <motion.div
                    key={countdown}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "Positions, cursive",
                      fontSize: 80, color: "#1BA5B2",
                      textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      zIndex: 3
                    }}
                  >
                    {countdown}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {flashSlot === 1 && (
                  <motion.div
                    className="flash-overlay"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Button — overlapping bottom of frame */}
            <div style={{
              position: "absolute",
              bottom: "-4%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}>
              {bothFilled ? (
                <Button icon="ri-check-line" onClick={handleReady} className="booth-btn">Ready</Button>
              ) : (
                <Button icon="ri-camera-line" onClick={handleCapture} disabled={isCapturing} className="booth-btn">
                  {isCapturing ? "Get Ready..." : "Capture"}
                </Button>
              )}
            </div>

          </div>

          {/* Upload / Reset link — below frame */}
          <div className="flex flex-col items-center" style={{ marginTop: 32 }}>
            {bothFilled ? (
              <button className="upload-link" onClick={() => setShowResetModal(true)}>
                <i className="ri-refresh-line" />
                Reset
              </button>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleUpload}
                  style={{ display: "none" }}
                />
                <button className="upload-link" onClick={() => fileInputRef.current?.click()}>
                  <i className="ri-upload-line" />
                  Upload Photos
                </button>
              </>
            )}
          </div>

        </div>

        {/* Reset Modal */}
        <AnimatePresence>
          {showResetModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
            >
              <motion.div
                className="modal-box"
                initial={{ scale: 0., opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 style={{ fontFamily: "Positions, cursive", color: "#16848E", fontSize: 24, marginBottom: 12 }}>
                  Reset Photos?
                </h2>
                <p style={{ color: "#605D5C", marginBottom: 24, fontSize: 16 }}>
                  This will delete both photos. Are you sure?
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="upload-link" onClick={() => setShowResetModal(false)}>
                    Cancel
                  </button>
                  <Button icon="ri-delete-bin-line" onClick={handleReset} className="booth-btn">
                    Yes, Reset
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </>
  )
}