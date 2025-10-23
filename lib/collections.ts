import { withBasePath } from './paths'

export interface Photo {
  id: number
  src: string
  alt: string
  span?: string
  metadata?: {
    camera?: string
    lens?: string
    focalLength?: string
    aperture?: string
    shutterSpeed?: string
    iso?: string
    date?: string
    location?: string
  }
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
    coverImage: withBasePath("/urban-street-photography-monochrome.jpg"),
    photos: [
      {
        id: 1,
        src: withBasePath("/urban-street-photography-monochrome.jpg"),
        alt: "Tokyo street at night",
        span: "md:col-span-2 md:row-span-2",
        metadata: {
          camera: "Sony A7III",
          lens: "Sony FE 35mm f/1.8",
          focalLength: "35mm",
          aperture: "f/1.8",
          shutterSpeed: "1/60s",
          iso: "3200",
          date: "March 15, 2024",
          location: "Shibuya, Tokyo",
        },
      },
      {
        id: 2,
        src: withBasePath("/black-and-white-architecture.png"),
        alt: "Tokyo architecture",
        span: "md:col-span-1 md:row-span-1",
        metadata: {
          camera: "Fujifilm X-T4",
          lens: "Fujinon XF 16mm f/1.4",
          focalLength: "16mm",
          aperture: "f/8",
          shutterSpeed: "1/250s",
          iso: "200",
          date: "March 16, 2024",
          location: "Shinjuku, Tokyo",
        },
      },
      {
        id: 3,
        src: withBasePath("/abstract-minimalist-photography.jpg"),
        alt: "Urban abstract",
        span: "md:col-span-1 md:row-span-1",
        metadata: {
          camera: "Canon EOS R5",
          lens: "Canon RF 50mm f/1.2",
          focalLength: "50mm",
          aperture: "f/2.8",
          shutterSpeed: "1/125s",
          iso: "800",
          date: "March 17, 2024",
          location: "Roppongi, Tokyo",
        },
      },
    ],
  },
  {
    id: "portraits",
    title: "Portraits",
    description: "Intimate moments captured in black and white",
    coverImage: withBasePath("/minimalist-black-and-white-portrait-photography.jpg"),
    photos: [
      {
        id: 1,
        src: withBasePath("/minimalist-black-and-white-portrait-photography.jpg"),
        alt: "Portrait photography",
        span: "md:col-span-1 md:row-span-2",
        metadata: {
          camera: "Nikon Z9",
          lens: "Nikkor Z 85mm f/1.8",
          focalLength: "85mm",
          aperture: "f/2",
          shutterSpeed: "1/200s",
          iso: "400",
          date: "April 5, 2024",
          location: "Studio, New York",
        },
      },
      {
        id: 2,
        src: withBasePath("/fine-art-photography-black-background.jpg"),
        alt: "Fine art portrait",
        span: "md:col-span-2 md:row-span-1",
        metadata: {
          camera: "Sony A7R IV",
          lens: "Sony FE 85mm f/1.4 GM",
          focalLength: "85mm",
          aperture: "f/1.4",
          shutterSpeed: "1/160s",
          iso: "100",
          date: "April 8, 2024",
          location: "Studio, New York",
        },
      },
    ],
  },
  {
    id: "landscapes",
    title: "Landscapes",
    description: "Natural beauty in monochrome",
    coverImage: withBasePath("/nature-landscape-black-and-white.jpg"),
    photos: [
      {
        id: 1,
        src: withBasePath("/nature-landscape-black-and-white.jpg"),
        alt: "Nature landscape",
        span: "md:col-span-2 md:row-span-1",
        metadata: {
          camera: "Canon EOS R5",
          lens: "Canon RF 24-70mm f/2.8",
          focalLength: "24mm",
          aperture: "f/11",
          shutterSpeed: "1/500s",
          iso: "100",
          date: "May 12, 2024",
          location: "Yosemite, California",
        },
      },
      {
        id: 2,
        src: withBasePath("/abstract-minimalist-photography.jpg"),
        alt: "Abstract nature",
        span: "md:col-span-1 md:row-span-2",
        metadata: {
          camera: "Fujifilm GFX 100S",
          lens: "Fujinon GF 63mm f/2.8",
          focalLength: "63mm",
          aperture: "f/5.6",
          shutterSpeed: "1/250s",
          iso: "200",
          date: "May 15, 2024",
          location: "Big Sur, California",
        },
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Geometric forms and structural elegance",
    coverImage: withBasePath("/black-and-white-architecture.png"),
    photos: [
      {
        id: 1,
        src: withBasePath("/black-and-white-architecture.png"),
        alt: "Modern architecture",
        span: "md:col-span-2 md:row-span-2",
        metadata: {
          camera: "Sony A7R V",
          lens: "Sony FE 16-35mm f/2.8 GM",
          focalLength: "16mm",
          aperture: "f/8",
          shutterSpeed: "1/320s",
          iso: "100",
          date: "June 3, 2024",
          location: "Chicago, Illinois",
        },
      },
      {
        id: 2,
        src: withBasePath("/minimalist-architectural-photography-black-backgro.jpg"),
        alt: "Minimalist architecture",
        span: "md:col-span-1 md:row-span-1",
        metadata: {
          camera: "Nikon Z8",
          lens: "Nikkor Z 14-24mm f/2.8",
          focalLength: "14mm",
          aperture: "f/11",
          shutterSpeed: "1/400s",
          iso: "64",
          date: "June 7, 2024",
          location: "New York, New York",
        },
      },
    ],
  },
]

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((collection) => collection.id === id)
}
