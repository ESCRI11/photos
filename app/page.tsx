import { Navigation } from "@/components/navigation"
import { Gallery } from "@/components/gallery"
import { getWorkPhotos } from "@/lib/data-loader"

export default function Home() {
  const photos = getWorkPhotos()
  
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Gallery photos={photos} />
    </main>
  )
}
