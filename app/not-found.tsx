import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6">
        <h1 className="font-serif text-6xl md:text-8xl text-foreground mb-4">404</h1>
        <p className="text-muted-foreground text-lg mb-8 tracking-wide">Page not found</p>
        <Link
          href="/"
          className="text-sm text-foreground hover:text-muted-foreground transition-colors tracking-wide uppercase border-b border-foreground hover:border-muted-foreground"
        >
          Return Home
        </Link>
      </div>
    </main>
  )
}
