// ── Domain types ─────────────────────────────────────────────────────────────

export interface Word {
  nombre:  string
  slug:    string
  url:     string
  texto:   string
  citas:   string[]
}

export interface LeondufourDB {
  version:  number
  scraped?: string
  total:    number
  palabras: Record<string, Word>
}

// ── Síntesis ──────────────────────────────────────────────────────────────────

export interface SintesisItem {
  texto: string
  id:    string
}

export interface SintesisSection {
  titulo: string
  id:     string
  level:  1 | 2 | 3
  items:  SintesisItem[]
}

// ── Citations ─────────────────────────────────────────────────────────────────

export interface CitasCategorizadas {
  libros:     string[]
  profetas:   string[]
  epistolas:  string[]
  evangelios: string[]
}
