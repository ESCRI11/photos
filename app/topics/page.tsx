import { Navigation } from "@/components/navigation"
import { CollectionsGrid } from "@/components/collections-grid"

export default function TopicsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-12 text-center md:hidden">Topics</h1>
          <CollectionsGrid />
        </div>
      </div>
    </main>
  )
}
