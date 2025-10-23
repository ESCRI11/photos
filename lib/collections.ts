import { getCollections as loadCollectionsData, type Collection as CollectionType, type Photo as PhotoType } from './data-loader'

export type Photo = PhotoType
export type Collection = CollectionType

export const collections: Collection[] = loadCollectionsData()

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((collection) => collection.id === id)
}
