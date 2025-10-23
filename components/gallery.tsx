"use client"

import Image from "next/image"
import { useState } from "react"
import { Lightbox } from "./lightbox"
import { withBasePath } from "@/lib/paths"

const photos = [
  {
    id: 1,
    src: withBasePath("/minimalist-black-and-white-portrait-photography.jpg"),
    alt: "Portrait photography",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    id: 2,
    src: withBasePath("/black-and-white-architecture.png"),
    alt: "Architectural photography",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    id: 3,
    src: withBasePath("/abstract-minimalist-photography.jpg"),
    alt: "Abstract photography",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    src: withBasePath("/nature-landscape-black-and-white.jpg"),
    alt: "Nature photography",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 5,
    src: withBasePath("/urban-street-photography-monochrome.jpg"),
    alt: "Street photography",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    id: 6,
    src: withBasePath("/fine-art-photography-black-background.jpg"),
    alt: "Fine art photography",
    span: "md:col-span-2 md:row-span-1",
  },
]

export function Gallery() {
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
        />
      )}
    </section>
  )
}
