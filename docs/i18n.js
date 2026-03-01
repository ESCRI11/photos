;(function () {
  const STORAGE_KEY = 'portfolio-lang'
  const DEFAULT_LANG = 'ca'

  const dict = {
    ca: {
      'nav.photos':       'Fotos',
      'nav.albums':       'Àlbums',
      'gallery.heading':  'Les meves fotos',
      'back':             'Tornar als àlbums',
      'meta.technical':   'Detalls tècnics',
      'meta.camera':      'Càmera',
      'meta.lens':        'Objectiu',
      'meta.focal':       'Focal',
      'meta.aperture':    'Obertura',
      'meta.shutter':     'Obturador',
      'meta.iso':         'ISO',
      'meta.date':        'Data',
      'meta.location':    'Lloc',
      'footer.rights':    'Tots els drets reservats.',
    },
    en: {
      'nav.photos':       'Photos',
      'nav.albums':       'Albums',
      'gallery.heading':  'My photos',
      'back':             'Back to albums',
      'meta.technical':   'Technical details',
      'meta.camera':      'Camera',
      'meta.lens':        'Lens',
      'meta.focal':       'Focal length',
      'meta.aperture':    'Aperture',
      'meta.shutter':     'Shutter speed',
      'meta.iso':         'ISO',
      'meta.date':        'Date',
      'meta.location':    'Location',
      'footer.rights':    'All rights reserved.',
    },
    it: {
      'nav.photos':       'Foto',
      'nav.albums':       'Album',
      'gallery.heading':  'Le mie foto',
      'back':             'Torna agli album',
      'meta.technical':   'Dettagli tecnici',
      'meta.camera':      'Fotocamera',
      'meta.lens':        'Obiettivo',
      'meta.focal':       'Focale',
      'meta.aperture':    'Apertura',
      'meta.shutter':     'Velocità otturatore',
      'meta.iso':         'ISO',
      'meta.date':        'Data',
      'meta.location':    'Luogo',
      'footer.rights':    'Tutti i diritti riservati.',
    },
  }

  // Merge per-page translations (collection titles/descriptions) into dict
  var pageTranslationsEl = document.getElementById('page-translations')
  if (pageTranslationsEl) {
    var pageTranslations = JSON.parse(pageTranslationsEl.textContent)
    Object.keys(pageTranslations).forEach(function (lang) {
      if (dict[lang]) Object.assign(dict[lang], pageTranslations[lang])
    })
  }

  // Priority: URL param → localStorage → default
  const urlLang = new URLSearchParams(window.location.search).get('lang')
  let currentLang = (urlLang && dict[urlLang]) ? urlLang : (localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG)
  if (!dict[currentLang]) currentLang = DEFAULT_LANG

  function t(key) {
    return (dict[currentLang] && dict[currentLang][key]) || dict[DEFAULT_LANG][key] || key
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang

    // Keep URL in sync so any copied link carries the language
    const url = new URL(window.location.href)
    url.searchParams.set('lang', currentLang)
    history.replaceState(null, '', url.toString())

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'))
    })

    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang)
    })

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }))
  }

  function setLang(lang) {
    if (!dict[lang] || lang === currentLang) return
    currentLang = lang
    localStorage.setItem(STORAGE_KEY, lang)
    applyTranslations()
  }

  // Expose globally so app.js can call t()
  window.t = t

  document.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'))
    })
  })

  applyTranslations()
})()
