#!/usr/bin/env node
// generate.js — Static site generator. Uses only Node.js built-ins.

const fs   = require('fs')
const path = require('path')

const BASE = '/photos'
const PUBLIC_DIR = path.join(__dirname, 'public')
const SRC_DIR    = path.join(__dirname, 'src')
const DOCS_DIR   = path.join(__dirname, 'docs')

// ─── Icons ───────────────────────────────────────────────────────────────────

const icons = {
  X: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  XSmall: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  ChevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`,
  ChevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`,
  Info: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  Menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  ArrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
}

// ─── Layout ──────────────────────────────────────────────────────────────────

function layout(title, content, { activePage = 'work' } = {}) {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="${BASE}/styles.css">
</head>
<body>
  <nav class="site-nav">
    <div class="nav-inner">
      <div class="nav-row">
        <a href="${BASE}/" class="nav-brand font-serif">Xavier Escrib&agrave; Montagut</a>
        <div class="nav-links-desktop">
          <a href="${BASE}/" class="nav-link" data-nav-href="${BASE}/">Fotos</a>
          <a href="${BASE}/topics/" class="nav-link" data-nav-href="${BASE}/topics/">Àlbums</a>
        </div>
        <button id="menu-toggle" class="nav-menu-btn" aria-label="Obrir el menú">
          <span id="menu-icon-open">${icons.Menu}</span>
          <span id="menu-icon-close" style="display:none">${icons.XSmall}</span>
        </button>
      </div>
      <div id="mobile-menu" class="nav-mobile">
        <a href="${BASE}/" class="nav-link" data-nav-href="${BASE}/">Fotos</a>
        <a href="${BASE}/topics/" class="nav-link" data-nav-href="${BASE}/topics/">Àlbums</a>
      </div>
    </div>
  </nav>

  <main>
    ${content}
  </main>

  <footer>
    <div class="footer-inner">
      <p>&copy; ${year} Xavier Escrib&agrave; Montagut. Tots els drets reservats.</p>
    </div>
  </footer>

  <!-- Lightbox (shared, populated by JS) -->
  <div id="lightbox" role="dialog" aria-modal="true" aria-label="Visualitzador de fotos">
    <button id="lb-close" class="lb-close-btn" aria-label="Tancar">${icons.X}</button>
    <button id="lb-info"  class="lb-info-btn"  aria-label="Informació (I)" title="Informació (I)">${icons.Info}</button>
    <button id="lb-prev"  class="lb-prev-btn"  aria-label="Imatge anterior">${icons.ChevronLeft}</button>
    <button id="lb-next"  class="lb-next-btn"  aria-label="Imatge següent">${icons.ChevronRight}</button>
    <div class="lb-content" id="lb-backdrop">
      <div class="lb-image-wrapper">
        <img id="lb-img" src="" alt="">
      </div>
      <div id="lb-meta" class="lb-meta"></div>
    </div>
    <div id="lb-counter"></div>
  </div>

  <script src="${BASE}/app.js"></script>
</body>
</html>`
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function mkdir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function write(filePath, content) {
  mkdir(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('  wrote', path.relative(__dirname, filePath))
}

function copyFile(src, dest) {
  mkdir(path.dirname(dest))
  fs.copyFileSync(src, dest)
}

// ─── Photo helpers ────────────────────────────────────────────────────────────

function photoSrc(file) {
  return `${BASE}/${file}`
}

function photoItem(photo, index) {
  const spanClass = photo.span ? ' ' + photo.span : ''
  const delay = index * 100
  return `<div class="photo-item${spanClass} animate-fade-in-up" data-index="${index}" style="animation-delay:${delay}ms" role="button" tabindex="0" aria-label="Obrir foto: ${escapeHtml(photo.alt)}">
      <img src="${photoSrc(photo.file)}" alt="${escapeHtml(photo.alt)}" loading="${index < 3 ? 'eager' : 'lazy'}">
      <div class="photo-overlay"></div>
    </div>`
}

function photosScript(photos) {
  const data = photos.map(function (p) {
    return {
      id: p.id,
      src: photoSrc(p.file),
      alt: p.alt,
      metadata: p.metadata || null,
    }
  })
  return `<script id="page-photos" type="application/json">${JSON.stringify(data)}</script>`
}

// ─── Page generators ──────────────────────────────────────────────────────────

function generateIndex(photos) {
  const workPhotos = photos.filter(function (p) {
    return Array.isArray(p.display) && p.display.includes('work')
  })

  const grid = workPhotos.map(photoItem).join('\n    ')

  const content = `
    <section class="gallery-section">
      <div class="gallery-container">
        <h2 class="font-serif">Les meves fotos</h2>
        <div class="photo-grid">
          ${grid}
        </div>
      </div>
    </section>
    ${photosScript(workPhotos)}`

  write(
    path.join(DOCS_DIR, 'index.html'),
    layout('Fotos — Xavier Escribà Montagut', content)
  )
}

function generateTopics(collections, photos) {
  const cards = collections.map(function (col) {
    return `<a href="${BASE}/collections/${col.id}/" class="collection-card">
        <img src="${photoSrc(col.coverImage)}" alt="${escapeHtml(col.title)}" loading="lazy">
        <div class="collection-card-overlay"></div>
        <div class="collection-card-text">
          <h3 class="font-serif">${escapeHtml(col.title)}</h3>
          <p>${escapeHtml(col.description)}</p>
        </div>
      </a>`
  }).join('\n      ')

  const content = `
    <section class="topics-section">
      <div class="topics-container">
        <div class="collections-grid">
          ${cards}
        </div>
      </div>
    </section>
    <script id="page-photos" type="application/json">[]</script>`

  write(
    path.join(DOCS_DIR, 'topics', 'index.html'),
    layout('Àlbums — Xavier Escribà Montagut', content, { activePage: 'topics' })
  )
}

function generateCollection(col, photos) {
  const topicKey = 'topics.' + col.id
  const colPhotos = photos.filter(function (p) {
    return Array.isArray(p.display) && p.display.includes(topicKey)
  })

  const grid = colPhotos.map(photoItem).join('\n    ')

  const content = `
    <section class="collection-section">
      <div class="collection-container">
        <a href="${BASE}/topics/" class="back-link">
          ${icons.ArrowLeft}
          Tornar als àlbums
        </a>
        <div class="collection-header">
          <h1 class="font-serif tracking-tight">${escapeHtml(col.title)}</h1>
          <p class="tracking-wide text-muted">${escapeHtml(col.description)}</p>
        </div>
        <div class="photo-grid">
          ${grid}
        </div>
      </div>
    </section>
    ${photosScript(colPhotos)}`

  write(
    path.join(DOCS_DIR, 'collections', col.id, 'index.html'),
    layout(`${col.title} — Xavier Escribà Montagut`, content, { activePage: 'topics' })
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Building static site...')

  // Read data
  const photosData      = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'photos.json'), 'utf8'))
  const collectionsData = JSON.parse(fs.readFileSync(path.join(PUBLIC_DIR, 'collections.json'), 'utf8'))
  const photos      = photosData.photos
  const collections = collectionsData.collections

  // Prepare docs/
  mkdir(DOCS_DIR)

  // Copy static assets
  console.log('\nCopying assets...')
  copyFile(path.join(SRC_DIR, 'styles.css'), path.join(DOCS_DIR, 'styles.css'))
  copyFile(path.join(SRC_DIR, 'app.js'),     path.join(DOCS_DIR, 'app.js'))
  console.log('  copied styles.css, app.js')

  // Copy images from public/
  const imageExts = /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i
  const publicFiles = fs.readdirSync(PUBLIC_DIR)
  let imgCount = 0
  publicFiles.forEach(function (file) {
    if (imageExts.test(file)) {
      copyFile(path.join(PUBLIC_DIR, file), path.join(DOCS_DIR, file))
      imgCount++
    }
  })
  console.log('  copied', imgCount, 'image files')

  // Generate HTML
  console.log('\nGenerating HTML...')
  generateIndex(photos)
  generateTopics(collections, photos)
  collections.forEach(function (col) {
    generateCollection(col, photos)
  })

  console.log('\nDone! Output in docs/')
}

main()
