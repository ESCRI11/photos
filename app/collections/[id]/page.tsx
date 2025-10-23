import { Navigation } from "@/components/navigation"
import { getCollectionById, collections } from "@/lib/collections"
import { CollectionView } from "@/components/collection-view"
import { notFound } from "next/navigation"

// Generate static paths for all collections
export function generateStaticParams() {
  return collections.map((collection) => ({
    id: collection.id,
  }))
}

export default function CollectionPage({
  params,
}: {
  params: { id: string }
}) {
  const collection = getCollectionById(params.id)

  if (!collection) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <CollectionView collection={collection} />
    </main>
  )
}
