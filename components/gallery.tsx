"use client"

import Image from "next/image"
import { useState } from "react"
import { Lightbox } from "./lightbox"
import { withBasePath } from "@/lib/paths"
import { useMetadataToggle } from "@/hooks/use-metadata-toggle"
import type { Photo } from "@/lib/data-loader"

interface GalleryProps {
  photos: Photo[]
}

export function Gallery({ photos }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const { showMetadata, setShowMetadata } = useMetadataToggle()

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const previousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <section id="work" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-16 text-center">Selected Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className={`relative overflow-hidden bg-card group cursor-pointer ${photo.span}`}
            >
              <Image
                src={photo.src || withBasePath("/placeholder.svg")}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          photos={photos}
          currentIndex={currentPhotoIndex}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrevious={previousPhoto}
          showMetadata={showMetadata}
          setShowMetadata={setShowMetadata}
        />
      )}
    </section>
  )
}
