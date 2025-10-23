"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Photo {
  id: number
  src: string
  alt: string
}

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function Lightbox({ photos, currentIndex, onClose, onNext, onPrevious }: LightboxProps) {
  const currentPhoto = photos[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrevious()
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [onClose, onNext, onPrevious])

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-foreground hover:text-muted-foreground transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={onPrevious}
          className="absolute left-6 text-foreground hover:text-muted-foreground transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeft size={48} />
        </button>
      )}

      {/* Next button */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-6 text-foreground hover:text-muted-foreground transition-colors z-10"
          aria-label="Next image"
        >
          <ChevronRight size={48} />
        </button>
      )}

      {/* Image */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto px-20">
        <Image
          src={currentPhoto.src || "/placeholder.svg"}
          alt={currentPhoto.alt}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground text-sm tracking-wide">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}
