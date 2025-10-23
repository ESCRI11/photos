"use client"

import { Lightbox } from "@/components/lightbox"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Collection } from "@/lib/collections"

interface CollectionViewProps {
  collection: Collection
}

export function CollectionView({ collection }: CollectionViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % collection.photos.length)
  }

  const previousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + collection.photos.length) % collection.photos.length)
  }

  return (
    <>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/topics"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 tracking-wide uppercase"
          >
            <ArrowLeft size={16} />
            Back to Topics
          </Link>
          <div className="mb-16">
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4 tracking-tight">{collection.title}</h1>
            <p className="text-muted-foreground text-lg tracking-wide">{collection.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
            {collection.photos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className={`relative overflow-hidden bg-card group cursor-pointer ${photo.span || ""}`}
              >
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <Lightbox
          photos={collection.photos}
          currentIndex={currentPhotoIndex}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrevious={previousPhoto}
        />
      )}
    </>
  )
}

