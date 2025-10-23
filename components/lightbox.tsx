"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { withBasePath } from "@/lib/paths"
import type { Photo } from "@/lib/collections"

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  showMetadata: boolean
  setShowMetadata: (show: boolean) => void
}

export function Lightbox({ photos, currentIndex, onClose, onNext, onPrevious, showMetadata, setShowMetadata }: LightboxProps) {
  const currentPhoto = photos[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrevious()
      if (e.key === "i" || e.key === "I") setShowMetadata(!showMetadata)
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [onClose, onNext, onPrevious, showMetadata, setShowMetadata])

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

      {/* Toggle metadata button (only show if metadata exists) */}
      {currentPhoto.metadata && (
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className={`hidden lg:block absolute top-6 right-[4.5rem] text-foreground hover:text-muted-foreground transition-colors z-10 ${
            showMetadata ? "opacity-50" : "opacity-100"
          }`}
          aria-label="Toggle metadata"
          title="Toggle info (I)"
        >
          <Info size={32} />
        </button>
      )}

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={onPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground hover:text-muted-foreground transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeft size={48} />
        </button>
      )}

      {/* Next button */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground hover:text-muted-foreground transition-colors z-10 md:right-auto md:left-1/2 md:-translate-x-1/2 md:top-auto md:bottom-6 md:translate-y-0"
          aria-label="Next image"
        >
          <ChevronRight size={48} className="md:rotate-90" />
        </button>
      )}

      {/* Main Content Container */}
      <div className="w-full h-full max-w-7xl mx-auto px-20 py-16 flex items-center gap-8">
        {/* Image */}
        <div className="relative flex-1 h-full">
          <Image
            src={currentPhoto.src || withBasePath("/placeholder.svg")}
            alt={currentPhoto.alt}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Metadata Panel */}
        {currentPhoto.metadata && showMetadata && (
          <div className="hidden lg:block w-80 h-full overflow-y-auto border-l border-border pl-8 animate-in fade-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-foreground mb-2">{currentPhoto.alt}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {currentIndex + 1} / {photos.length}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground">Technical Details</h4>
                
                {currentPhoto.metadata.camera && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Camera</p>
                    <p className="text-sm text-foreground">{currentPhoto.metadata.camera}</p>
                  </div>
                )}

                {currentPhoto.metadata.lens && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Lens</p>
                    <p className="text-sm text-foreground">{currentPhoto.metadata.lens}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {currentPhoto.metadata.focalLength && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Focal Length</p>
                      <p className="text-sm text-foreground">{currentPhoto.metadata.focalLength}</p>
                    </div>
                  )}

                  {currentPhoto.metadata.aperture && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Aperture</p>
                      <p className="text-sm text-foreground">{currentPhoto.metadata.aperture}</p>
                    </div>
                  )}

                  {currentPhoto.metadata.shutterSpeed && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Shutter Speed</p>
                      <p className="text-sm text-foreground">{currentPhoto.metadata.shutterSpeed}</p>
                    </div>
                  )}

                  {currentPhoto.metadata.iso && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">ISO</p>
                      <p className="text-sm text-foreground">{currentPhoto.metadata.iso}</p>
                    </div>
                  )}
                </div>

                {(currentPhoto.metadata.date || currentPhoto.metadata.location) && (
                  <div className="pt-4 border-t border-border space-y-3">
                    {currentPhoto.metadata.date && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Date</p>
                        <p className="text-sm text-foreground">{currentPhoto.metadata.date}</p>
                      </div>
                    )}

                    {currentPhoto.metadata.location && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Location</p>
                        <p className="text-sm text-foreground">{currentPhoto.metadata.location}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Counter for mobile/tablet (when metadata panel is hidden) */}
      <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground text-sm tracking-wide">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}
