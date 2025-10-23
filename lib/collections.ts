export interface Photo {
  id: number
  src: string
  alt: string
  span?: string
}

export interface Collection {
  id: string
  title: string
  description: string
  coverImage: string
  photos: Photo[]
}

export const collections: Collection[] = [
  {
    id: "tokyo-nights",
    title: "Tokyo Nights",
    description: "Urban exploration through the neon-lit streets of Tokyo",
    coverImage: "/urban-street-photography-monochrome.jpg",
    photos: [
      {
        id: 1,
        src: "/urban-street-photography-monochrome.jpg",
        alt: "Tokyo street at night",
        span: "md:col-span-2 md:row-span-2",
      },
      {
        id: 2,
        src: "/black-and-white-architecture.png",
        alt: "Tokyo architecture",
        span: "md:col-span-1 md:row-span-1",
      },
      {
        id: 3,
        src: "/abstract-minimalist-photography.jpg",
        alt: "Urban abstract",
        span: "md:col-span-1 md:row-span-1",
      },
    ],
  },
  {
    id: "portraits",
    title: "Portraits",
    description: "Intimate moments captured in black and white",
    coverImage: "/minimalist-black-and-white-portrait-photography.jpg",
    photos: [
      {
        id: 1,
        src: "/minimalist-black-and-white-portrait-photography.jpg",
        alt: "Portrait photography",
        span: "md:col-span-1 md:row-span-2",
      },
      {
        id: 2,
        src: "/fine-art-photography-black-background.jpg",
        alt: "Fine art portrait",
        span: "md:col-span-2 md:row-span-1",
      },
    ],
  },
  {
    id: "landscapes",
    title: "Landscapes",
    description: "Natural beauty in monochrome",
    coverImage: "/nature-landscape-black-and-white.jpg",
    photos: [
      {
        id: 1,
        src: "/nature-landscape-black-and-white.jpg",
        alt: "Nature landscape",
        span: "md:col-span-2 md:row-span-1",
      },
      {
        id: 2,
        src: "/abstract-minimalist-photography.jpg",
        alt: "Abstract nature",
        span: "md:col-span-1 md:row-span-2",
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Geometric forms and structural elegance",
    coverImage: "/black-and-white-architecture.png",
    photos: [
      {
        id: 1,
        src: "/black-and-white-architecture.png",
        alt: "Modern architecture",
        span: "md:col-span-2 md:row-span-2",
      },
      {
        id: 2,
        src: "/minimalist-architectural-photography-black-backgro.jpg",
        alt: "Minimalist architecture",
        span: "md:col-span-1 md:row-span-1",
      },
    ],
  },
]

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((collection) => collection.id === id)
}
