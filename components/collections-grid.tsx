import Image from "next/image"
import Link from "next/link"
import { collections } from "@/lib/collections"

export function CollectionsGrid() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group relative overflow-hidden bg-card aspect-[4/3] cursor-pointer"
            >
              <Image
                src={collection.coverImage || "/placeholder.svg"}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/60 group-hover:bg-background/40 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-3 tracking-tight">
                  {collection.title}
                </h3>
                <p className="text-muted-foreground text-sm tracking-wide uppercase">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
