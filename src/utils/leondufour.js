// ── HTML entity decode (for scraper-sourced text with literal entities) ───
export function decodeEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&') // must be last
}

// ── HTML escape ───────────────────────────────────────────────────────────
export function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Shared: slugify a section title for use as an HTML id ─────────────────
function _slugifySection(titulo) {
  return 'sec-' + titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Article text processing ───────────────────────────────────────────────
function _classify(parrafo) {
  if (!parrafo || parrafo === 'Mostrar citas agrupadas') return 'skip'
  // Scraper-tagged headings: §1 = h2, §2 = h3, §3 = h4 (from scripts/scrape.js)
  if (/^§\d /.test(parrafo)) return 'section'
  // Roman numeral section headers: "I. Título", "II. Subtítulo", etc.
  if (/^[IVX]+\.\s+[A-ZÁÉÍÓÚÜÑ]/.test(parrafo)) return 'section'
  // Short all-uppercase headings: "AT", "NT", "CONCLUSIÓN", "SUMARIO", etc.
  if (parrafo.length <= 40 && /^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9\s./()-]*$/.test(parrafo)) return 'section'
  if (/^[0-9]+[.)]\s/.test(parrafo) && parrafo.length < 120) return 'subitem'
  return 'paragraph'
}

// Strip scraper §N prefix to get the display title
function _sectionTitle(p) {
  return p.replace(/^§\d /, '')
}

// Determine visual hierarchy level (1 = most prominent, 3 = least)
function _sectionLevel(p) {
  // New scraper format: §1 (h2) → lv1, §2 (h3) → lv2, §3+ → lv3
  const m = p.match(/^§(\d) /)
  if (m) return Math.min(parseInt(m[1]), 3)
  // Roman numerals checked first — they can be all-caps so must precede the all-caps check
  if (/^[IVX]+\.\s+/.test(p)) return 2
  // Short all-uppercase headings: "AT", "NT", "CONCLUSIÓN", etc.
  if (p.length <= 40 && /^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9\s./()-]*$/.test(p)) return 1
  return 3  // numbered sections
}

// Receives RAW (unescaped, decoded) text — handles escaping internally
// Section headers get an id attribute for in-page anchoring
export function resaltarCitas(texto, citas) {
  // Build a map from original citation → normalized form (with book prefix)
  const normArr  = normalizarCitas(citas)
  const normMap  = Object.fromEntries(citas.map((c, i) => [c, normArr[i]]))

  const escapadas = citas.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const patron = escapadas.length ? new RegExp(`(${escapadas.join('|')})`, 'g') : null

  function highlight(str) {
    if (!patron) return str
    return str.replace(patron, m => {
      const norm = normMap[m] || m
      return `<span class="cita-inline" data-cita="${norm.replace(/"/g, '&quot;')}">${m}</span>`
    })
  }

  return texto
    .replace(/\n\n+/g, '\n\n')
    .split('\n\n')
    .map(parrafo => {
      const p = parrafo.trim()
      const type = _classify(p)
      if (type === 'skip') return ''
      if (type === 'section') {
        const titulo = _sectionTitle(p)
        const level  = _sectionLevel(p)
        const id     = _slugifySection(titulo)
        return `<h3 class="article-section article-section--lv${level}" id="${id}">${escapeHTML(titulo)}</h3>`
      }
      const escaped = escapeHTML(p)
      if (type === 'subitem') {
        const id = _slugifySection(p)
        return `<p class="article-num" id="${id}">${highlight(escaped)}</p>`
      }
      return `<p>${highlight(escaped)}</p>`
    })
    .join('')
}

// ── Síntesis extractor ────────────────────────────────────────────────────
// Returns an array of { titulo, id, items: [{ texto, id }] } from the article outline
export function extraerSintesis(textoOriginal) {
  if (!textoOriginal) return []
  const texto = decodeEntities(textoOriginal)
  const secciones = []
  let actual = null

  const bloques = texto.replace(/\n\n+/g, '\n\n').split('\n\n').map(b => b.trim()).filter(Boolean)

  for (const p of bloques) {
    const type = _classify(p)
    if (type === 'section') {
      const titulo = _sectionTitle(p)
      const level  = _sectionLevel(p)
      actual = { titulo, id: _slugifySection(titulo), level, items: [] }
      secciones.push(actual)
    } else if (type === 'subitem' && actual) {
      actual.items.push({ texto: p, id: _slugifySection(p) })
    }
  }

  // If no section headers found, promote subitems to top-level clickable sections
  if (secciones.length === 0) {
    for (const p of bloques) {
      if (_classify(p) === 'subitem') {
        secciones.push({ titulo: p, id: _slugifySection(p), level: 3, items: [] })
      }
    }
  }

  return secciones
}

// ── Citation categorization ───────────────────────────────────────────────
const EVANGELIOS = new Set([
  'mt', 'mc', 'mk', 'lc', 'jn', 'hch', 'act',
])
const EPISTOLAS = new Set([
  'rom', '1cor', '2cor', '1co', '2co', 'gál', 'gal', 'ga', 'ef', 'flp', 'fil',
  'col', '1tes', '2tes', '1ts', '2ts', '1tim', '2tim', '1ti', '2ti',
  'tit', 'flm', 'heb', 'sant', 'stg', '1pe', '2pe', '1p', '2p',
  '1jn', '2jn', '3jn', 'jds', 'jud', 'ap', 'rev', 'apoc',
])
const PROFETAS = new Set([
  'is', 'jer', 'jr', 'lam', 'ez', 'dan', 'dn',
  'os', 'jl', 'am', 'abd', 'jon', 'miq', 'nah', 'hab', 'sof', 'ag', 'zac', 'mal', 'bar',
])

function _extractLibro(cita) {
  const m = cita.trim().match(/^(\d?[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)/)
  return m ? m[1].toLowerCase() : ''
}

// Fills in missing book prefixes for bare citations (e.g. "13,15ss" → "Gen 13,15ss").
// Bare citations are those that start with a digit — they inherit the last known book.
export function normalizarCitas(citas) {
  let lastBook = ''
  return citas.map(cita => {
    const t = cita.trim()
    if (!t) return t
    // Has a book prefix if it starts with a letter (Gen, Mt…)
    // OR with digit+letter (1Cor, 2Tim, 1Pe…) — those are NOT bare chapter refs
    if (/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ]/.test(t) || /^\d[A-Za-záéíóúüñÁÉÍÓÚÜÑ]/.test(t)) {
      const m = t.match(/^(\d?[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)/)
      if (m) lastBook = m[1]
      return t
    }
    // Bare citation: starts with digit+digit or digit+comma (e.g. "13,15ss", "22,17")
    return lastBook ? `${lastBook} ${t}` : t
  })
}

export function categorizarCitas(citas) {
  const normalized = normalizarCitas(citas)
  const cats = { libros: [], profetas: [], epistolas: [], evangelios: [] }
  for (const cita of normalized) {
    const libro = _extractLibro(cita)
    if      (EVANGELIOS.has(libro)) cats.evangelios.push(cita)
    else if (EPISTOLAS.has(libro))  cats.epistolas.push(cita)
    else if (PROFETAS.has(libro))   cats.profetas.push(cita)
    else                            cats.libros.push(cita)
  }
  return cats
}
