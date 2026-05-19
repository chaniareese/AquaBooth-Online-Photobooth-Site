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