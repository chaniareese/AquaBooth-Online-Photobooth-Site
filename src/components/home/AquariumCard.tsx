"use client"

import Image from "next/image"
import Button from "@/components/shared/Button"
import { useRouter } from "next/navigation"


export default function AquariumCard() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="relative" style={{ maxWidth: 700, width: "100%" }}>

        <Image
          src="/assets/home/aquarium.gif"
          alt="Aquabooth"
          width={900}
          height={600}
          style={{ width: "100%", height: "auto" }}
          unoptimized
          priority
        />

        <div style={{
position: "absolute",
  bottom: "7%",
  left: "35%",
  transform: "translateX(-50%)"
}}>
  <Button icon="ri-login-box-line" onClick={() => router.push("/booth")}>Start</Button>
</div>

      </div>
    </div>
  )
}