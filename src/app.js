// ─── Navigation ──────────────────────────────────────────────────────────────

(function () {
  const path = window.location.pathname

  // Active link detection (matches Next.js navigation.tsx logic)
  document.querySelectorAll('[data-nav-href]').forEach(function (link) {
    const href = link.getAttribute('data-nav-href')
    const isWork = href === '/photos/' || href === '/photos'
    const isTopics = href === '/photos/topics/' || href === '/photos/topics'

    let active = false
    if (isWork) {
      active = path === '/photos/' || path === '/photos'
    } else if (isTopics) {
      active =
        path.startsWith('/photos/topics') ||
        path.startsWith('/photos/collections')
    }

    if (active) {
      link.classList.add('active')
    }
  })

  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-toggle')
  const mobileMenu = document.getElementById('mobile-menu')
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('open')
    })
  }
})()

// ─── Lightbox ─────────────────────────────────────────────────────────────────

;(function () {
  // Load photos from the embedded script tag
  const dataEl = document.getElementById('page-photos')
  if (!dataEl) return
  const photos = JSON.parse(dataEl.textContent)

  const STORAGE_KEY = 'portfolio-show-metadata'

  let currentIndex = -1
  let showMetadata = localStorage.getItem(STORAGE_KEY) !== 'false'

  // Elements
  const lightbox   = document.getElementById('lightbox')
  const lbImg      = document.getElementById('lb-img')
  const lbClose    = document.getElementById('lb-close')
  const lbInfoBtn  = document.getElementById('lb-info')
  const lbPrev     = document.getElementById('lb-prev')
  const lbNext     = document.getElementById('lb-next')
  const lbMeta     = document.getElementById('lb-meta')
  const lbCounter  = document.getElementById('lb-counter')

  if (!lightbox) return

  function metaField(label, value) {
    if (!value) return ''
    return '<div class="lb-meta-field"><label>' + label + '</label><p>' + value + '</p></div>'
  }

  function renderMeta(photo, index) {
    const m = photo.metadata || {}
    let html = '<div class="lb-meta-counter">' + (index + 1) + ' / ' + photos.length + '</div>'

    if (photo.metadata) {
      html += '<div class="lb-meta-section">'
      html += '<h4>Technical Details</h4>'
      html += metaField('Camera', m.camera)
      html += metaField('Lens', m.lens)
      if (m.focalLength || m.aperture || m.shutterSpeed || m.iso) {
        html += '<div class="lb-meta-grid">'
        html += metaField('Focal Length', m.focalLength)
        html += metaField('Aperture', m.aperture)
        html += metaField('Shutter Speed', m.shutterSpeed)
        html += metaField('ISO', m.iso)
        html += '</div>'
      }
      html += '</div>'

      if (m.date || m.location) {
        html += '<div class="lb-meta-section">'
        html += metaField('Date', m.date)
        html += metaField('Location', m.location)
        html += '</div>'
      }
    }

    lbMeta.innerHTML = html
  }

  function applyMetadataState() {
    if (showMetadata && photos[currentIndex] && photos[currentIndex].metadata) {
      lbMeta.classList.add('open')
      lbCounter.classList.add('hidden')
      lbInfoBtn && lbInfoBtn.classList.add('active')
    } else {
      lbMeta.classList.remove('open')
      lbCounter.classList.remove('hidden')
      lbInfoBtn && lbInfoBtn.classList.remove('active')
    }
  }

  function updateCounter() {
    if (lbCounter) {
      lbCounter.textContent = (currentIndex + 1) + ' / ' + photos.length
    }
  }

  function updateNav() {
    if (lbPrev) lbPrev.hidden = currentIndex <= 0
    if (lbNext) lbNext.hidden = currentIndex >= photos.length - 1
  }

  function open(index) {
    currentIndex = index
    const photo = photos[index]

    // Update image
    lbImg.src = photo.src
    lbImg.alt = photo.alt

    // Show/hide info button based on metadata presence
    if (lbInfoBtn) {
      lbInfoBtn.hidden = !photo.metadata
    }

    renderMeta(photo, index)
    updateNav()
    updateCounter()
    applyMetadataState()

    lightbox.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  function close() {
    lightbox.classList.remove('open')
    document.body.style.overflow = ''
    currentIndex = -1
  }

  function prev() {
    if (currentIndex > 0) open(currentIndex - 1)
  }

  function next() {
    if (currentIndex < photos.length - 1) open(currentIndex + 1)
  }

  function toggleMetadata() {
    showMetadata = !showMetadata
    localStorage.setItem(STORAGE_KEY, String(showMetadata))
    applyMetadataState()
  }

  // Wire up photo grid clicks
  document.querySelectorAll('[data-index]').forEach(function (el) {
    el.addEventListener('click', function () {
      open(parseInt(el.getAttribute('data-index'), 10))
    })
  })

  // Lightbox controls
  if (lbClose) lbClose.addEventListener('click', close)
  if (lbPrev)  lbPrev.addEventListener('click', prev)
  if (lbNext)  lbNext.addEventListener('click', next)
  if (lbInfoBtn) lbInfoBtn.addEventListener('click', function (e) {
    e.stopPropagation()
    toggleMetadata()
  })

  // Click backdrop to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.id === 'lb-backdrop') close()
  })

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return
    if (e.key === 'Escape')     close()
    if (e.key === 'ArrowLeft')  prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'i' || e.key === 'I') toggleMetadata()
  })
})()
