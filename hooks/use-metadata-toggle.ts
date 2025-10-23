import { useState, useEffect } from "react"

export function useMetadataToggle() {
  const [showMetadata, setShowMetadata] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("showPhotoMetadata")
    if (stored !== null) {
      setShowMetadata(stored === "true")
    }
  }, [])

  // Save to localStorage whenever it changes
  const toggleMetadata = (value: boolean) => {
    setShowMetadata(value)
    localStorage.setItem("showPhotoMetadata", String(value))
  }

  return { showMetadata, setShowMetadata: toggleMetadata }
}

