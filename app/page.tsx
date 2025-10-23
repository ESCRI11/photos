import { Navigation } from "@/components/navigation"
import { Gallery } from "@/components/gallery"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Gallery />
    </main>
  )
}
