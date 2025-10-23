export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <p className="text-xs text-muted-foreground text-center">
          © {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  )
}

