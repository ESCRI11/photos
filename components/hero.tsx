export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 tracking-tight text-balance">
          Visual Stories Through Light
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Capturing moments that transcend time, one frame at a time
        </p>
        <div className="mt-12">
          <a
            href="#work"
            className="inline-block text-sm text-foreground border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors tracking-wide uppercase"
          >
            View Work
          </a>
        </div>
      </div>
    </section>
  )
}
