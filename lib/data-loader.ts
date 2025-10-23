import fs from 'fs'
import path from 'path'
import { withBasePath } from './paths'

export interface PhotoMetadata {
  camera?: string
  lens?: string
  focalLength?: string
  aperture?: string
  shutterSpeed?: string
  iso?: string
  date?: string
  location?: string
}

export interface PhotoData {
  id: string
  file: string
  alt: string
  display: string[]
  span?: string
  metadata?: PhotoMetadata
}

export interface CollectionData {
  id: string
  title: string
  description: string
  coverImage: string
}

interface PhotosYAML {
  photos: PhotoData[]
}

interface CollectionsYAML {
  collections: CollectionData[]
}

export function loadPhotos(): PhotoData[] {
  const filePath = path.join(process.cwd(), 'public', 'photos.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContents) as PhotosYAML
  return data.photos
}

export function loadCollections(): CollectionData[] {
  const filePath = path.join(process.cwd(), 'public', 'collections.json')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(fileContents) as CollectionsYAML
  return data.collections
}

export function getPhotosForDisplay(displayKey: string): PhotoData[] {
  const allPhotos = loadPhotos()
  return allPhotos.filter(photo => photo.display.includes(displayKey))
}

export function getPhotosForCollection(collectionId: string): PhotoData[] {
  return getPhotosForDisplay(`topics.${collectionId}`)
}

export interface Photo {
  id: number
  src: string
  alt: string
  span?: string
  metadata?: PhotoMetadata
}

export function convertPhotoData(photoData: PhotoData, index: number): Photo {
  return {
    id: index + 1,
    src: withBasePath(`/${photoData.file}`),
    alt: photoData.alt,
    span: photoData.span,
    metadata: photoData.metadata,
  }
}

export interface Collection {
  id: string
  title: string
  description: string
  coverImage: string
  photos: Photo[]
}

export function getCollections(): Collection[] {
  const collectionData = loadCollections()
  
  return collectionData.map(collection => {
    const photos = getPhotosForCollection(collection.id)
    return {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      coverImage: withBasePath(`/${collection.coverImage}`),
      photos: photos.map((photo, index) => convertPhotoData(photo, index)),
    }
  })
}

export function getWorkPhotos(): Photo[] {
  const photos = getPhotosForDisplay('work')
  return photos.map((photo, index) => convertPhotoData(photo, index))
}

