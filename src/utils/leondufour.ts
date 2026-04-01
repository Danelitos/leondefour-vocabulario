import type { SintesisSection, SintesisItem, CitasCategorizadas } from '../types'

// ── HTML entity decode ────────────────────────────────────────────────────────
export function decodeEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&') // must be last
}

// ── HTML escape ───────────────────────────────────────────────────────────────
export function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Slugify a section title for use as an HTML id ─────────────────────────────
function _slugifySection(titulo: string): string {
  return 'sec-' + titulo
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Article block classifier ──────────────────────────────────────────────────
type BlockType = 'skip' | 'section' | 'subitem' | 'paragraph'

function _classify(parrafo: string): BlockType {
  if (!parrafo || parrafo === 'Mostrar citas agrupadas') return 'skip'
  // Scraper-tagged headings: §1 = h2, §2 = h3, §3 = h4
  if (/^§\d /.test(parrafo)) return 'section'
  // Roman numeral section headers: "I. Título", "II. Subtítulo", etc.
  if (/^[IVX]+\.\s+[A-ZÁÉÍÓÚÜÑ]/.test(parrafo)) return 'section'
  // Short all-uppercase headings: "AT", "NT", "CONCLUSIÓN", etc.
  if (parrafo.length <= 40 && /^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9\s./()-]*$/.test(parrafo)) return 'section'
  if (/^[0-9]+[.)]\s/.test(parrafo) && parrafo.length < 120) return 'subitem'
  return 'paragraph'
}

// Strip §N prefix to get the display title
function _sectionTitle(p: string): string {
  return p.replace(/^§\d /, '')
}

// Determine visual hierarchy level (1 = most prominent, 3 = least)
function _sectionLevel(p: string): 1 | 2 | 3 {
  const m = p.match(/^§(\d) /)
  if (m) return (Math.min(parseInt(m[1]), 3) as 1 | 2 | 3)
  // Roman numerals checked first (can be all-caps)
  if (/^[IVX]+\.\s+/.test(p)) return 2
  // Short all-uppercase headings: "AT", "NT", etc.
  if (p.length <= 40 && /^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ0-9\s./()-]*$/.test(p)) return 1
  return 3
}

// ── Highlight citations in article text ──────────────────────────────────────
// Receives RAW (decoded, unescaped) text — handles escaping internally.
// Section headers get an id for in-page anchoring.
export function resaltarCitas(texto: string, citas: string[]): string {
  const normArr = normalizarCitas(citas)
  const normMap = Object.fromEntries(citas.map((c, i) => [c, normArr[i]]))

  // Escape each citation string for safe use in RegExp
  const escapadas = citas.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const patron = escapadas.length
    ? new RegExp(`(${escapadas.join('|')})`, 'g')
    : null

  function highlight(str: string): string {
    if (!patron) return str
    return str.replace(patron, m => {
      const norm = normMap[m] ?? m
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

// ── Síntesis extractor ────────────────────────────────────────────────────────
// Returns a structured outline of sections and sub-items for navigation.
export function extraerSintesis(textoOriginal: string | null | undefined): SintesisSection[] {
  if (!textoOriginal) return []
  const texto   = decodeEntities(textoOriginal)
  const bloques = texto.replace(/\n\n+/g, '\n\n').split('\n\n').map(b => b.trim()).filter(Boolean)

  const secciones: SintesisSection[] = []
  let actual: SintesisSection | null = null

  for (const p of bloques) {
    const type = _classify(p)
    if (type === 'section') {
      const titulo = _sectionTitle(p)
      const level  = _sectionLevel(p)
      actual = { titulo, id: _slugifySection(titulo), level, items: [] }
      secciones.push(actual)
    } else if (type === 'subitem' && actual !== null) {
      const item: SintesisItem = { texto: p, id: _slugifySection(p) }
      actual.items.push(item)
    }
  }

  // No named sections found → promote numbered items to top-level clickable sections
  if (secciones.length === 0) {
    for (const p of bloques) {
      if (_classify(p) === 'subitem') {
        secciones.push({ titulo: p, id: _slugifySection(p), level: 3, items: [] })
      }
    }
  }

  return secciones
}

// ── Citation normalization ────────────────────────────────────────────────────
// Fills in missing book prefixes for bare citations (e.g. "13,15ss" → "Gen 13,15ss").
// Bare citations start with digit+digit/comma. Numbered books like "1Cor"
// start with digit+letter and are NOT treated as bare.
export function normalizarCitas(citas: string[]): string[] {
  let lastBook = ''
  return citas.map(cita => {
    const t = cita.trim()
    if (!t) return t
    // Has a book prefix: starts with letter, OR digit+letter (1Cor, 2Tim, 1Pe…)
    if (/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ]/.test(t) || /^\d[A-Za-záéíóúüñÁÉÍÓÚÜÑ]/.test(t)) {
      const m = t.match(/^(\d?[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)/)
      if (m) lastBook = m[1]
      return t
    }
    // Bare citation (digit+digit/comma): prepend last known book
    return lastBook ? `${lastBook} ${t}` : t
  })
}

// ── Citation categorization ───────────────────────────────────────────────────
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

function _extractLibro(cita: string): string {
  const m = cita.trim().match(/^(\d?[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)/)
  return m ? m[1].toLowerCase() : ''
}

export function categorizarCitas(citas: string[]): CitasCategorizadas {
  const normalized = normalizarCitas(citas)
  const cats: CitasCategorizadas = { libros: [], profetas: [], epistolas: [], evangelios: [] }
  for (const cita of normalized) {
    const libro = _extractLibro(cita)
    if      (EVANGELIOS.has(libro)) cats.evangelios.push(cita)
    else if (EPISTOLAS.has(libro))  cats.epistolas.push(cita)
    else if (PROFETAS.has(libro))   cats.profetas.push(cita)
    else                            cats.libros.push(cita)
  }
  return cats
}
