#!/usr/bin/env node
/**
 * Scraper: leondufour.com JS bundle → public/leondufour_data.json
 *
 * The site is a Vite SPA — all word data is embedded in the JS bundle.
 * This script extracts it directly without needing a headless browser.
 *
 * Requires cheerio:
 *   npm install --save-dev cheerio
 *
 * Run:
 *   node scripts/scrape.js
 */

import * as cheerio from 'cheerio'
import { writeFileSync }    from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath }    from 'node:url'
import vm                   from 'node:vm'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')
const OUT_FILE  = resolve(ROOT, 'public', 'leondufour_data.json')

const BUNDLE_URL = 'https://leondufour.com/assets/index-B6X86RFV.js'

// ── fetch ─────────────────────────────────────────────────────────────────────

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; leondufour-client/1.0)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

// ── extract the Nl=[...] array from minified JS ───────────────────────────────
// Walks the string tracking quote/backtick/bracket depth to find array boundaries.

function extractArray(source, marker = 'Nl=[{') {
  const start = source.indexOf(marker)
  if (start === -1) throw new Error(`Marker "${marker}" not found in bundle`)

  const arrayStart = start + marker.indexOf('[')
  let depth   = 0
  let inDouble  = false
  let inSingle  = false
  let inBack    = false
  let i = arrayStart

  while (i < source.length) {
    const ch = source[i]
    const prev = i > 0 ? source[i - 1] : ''

    if (inBack) {
      if (ch === '`' && prev !== '\\') inBack = false
      i++; continue
    }
    if (inDouble) {
      if (ch === '"'  && prev !== '\\') inDouble = false
      i++; continue
    }
    if (inSingle) {
      if (ch === "'"  && prev !== '\\') inSingle = false
      i++; continue
    }

    if      (ch === '`') { inBack   = true }
    else if (ch === '"') { inDouble = true }
    else if (ch === "'") { inSingle = true }
    else if (ch === '[' || ch === '{') { depth++ }
    else if (ch === ']' || ch === '}') {
      depth--
      if (depth === 0) return source.slice(arrayStart, i + 1)
    }
    i++
  }
  throw new Error('Unterminated array in bundle')
}

// ── Normalize bare citations (no book prefix) by inheriting the last book ─────

function normalizarCitas(citas) {
  let lastBook = ''
  return citas.map(cita => {
    const t = cita.trim()
    if (!t) return t
    if (/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ]/.test(t)) {
      const m = t.match(/^(\d?[A-Za-záéíóúüñÁÉÍÓÚÜÑ]+)/)
      if (m) lastBook = m[1]
      return t
    }
    return lastBook ? `${lastBook} ${t}` : t
  })
}

// ── parse HTML content → { texto, citas } ────────────────────────────────────

function parseContent(html) {
  const $ = cheerio.load(html)

  // 1. Collect <cite> elements IN ORDER of appearance (order matters for normalization)
  const citasRaw = []
  $('cite').each((_, el) => {
    const t = $(el).text().trim()
    if (t) citasRaw.push(t)
  })

  // Normalize bare citations (e.g. "13,15ss" → "Gen 13,15ss"), then deduplicate
  const citas = [...new Set(normalizarCitas(citasRaw))]

  // 2. Replace <cite> with its normalized text so inline text matches the citas array
  let citaIdx = 0
  $('cite').each((_, el) => {
    const t = $(el).text().trim()
    if (!t) return
    $(el).replaceWith(citas[citaIdx] ?? t)
    citaIdx++
  })

  // 3. Walk block elements to build plain-text paragraphs
  const blocks = []

  $('p, h1, h2, h3, h4, h5, li').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const raw = $(el).text().replace(/\s+/g, ' ').trim()
    if (!raw) return

    if (/^h[1-6]$/.test(tag)) {
      // Tag headings with §N prefix (N = heading level 1-3) so _classify() can determine hierarchy
      // h2 → §1, h3 → §2, h4+ → §3
      const level = Math.min(parseInt(tag[1]) - 1, 3)
      blocks.push(`§${level} ` + raw)
    } else {
      blocks.push(raw)
    }
  })

  const texto = blocks.join('\n\n')

  return { texto, citas }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('── León Dufour scraper (bundle mode) ───────────────────')
  console.log(`Output: ${OUT_FILE}`)
  console.log()

  // 1. Download JS bundle
  console.log(`Fetching bundle: ${BUNDLE_URL}`)
  console.log('(~8.5 MB — this may take a moment…)')
  const source = await fetchText(BUNDLE_URL)
  console.log(`Downloaded ${(source.length / 1024 / 1024).toFixed(1)} MB`)
  console.log()

  // 2. Extract the word data array
  console.log('Extracting word data array…')
  const arrayStr = extractArray(source, 'Nl=[{')

  // 3. Evaluate JS safely to get the array
  console.log('Evaluating array…')
  const sandbox = Object.create(null)
  vm.runInNewContext(`__result = ${arrayStr}`, sandbox)
  const entries = sandbox.__result
  console.log(`Found ${entries.length} words.`)
  console.log()

  // 4. Parse each entry
  const palabras = {}
  let i = 0
  for (const entry of entries) {
    i++
    const pct = Math.round((i / entries.length) * 100)
    const { id, title, content } = entry
    if (!id || !title) continue

    process.stdout.write(`[${i}/${entries.length}] (${pct}%) ${title}… `)

    const slug = id  // already a slug (e.g. "accion_de_gracias")
    const url  = `https://leondufour.com/palabra/${slug}`

    const { texto, citas } = parseContent(content || '')

    palabras[slug] = { nombre: title, slug, url, texto, citas }
    process.stdout.write(`✓ (${citas.length} citas, ${texto.length} chars)\n`)
  }

  // 5. Write output
  const output = {
    version:  2,
    scraped:  new Date().toISOString(),
    total:    Object.keys(palabras).length,
    palabras,
  }

  writeFileSync(OUT_FILE, JSON.stringify(output, null, 2), 'utf8')
  console.log()
  console.log(`✓ Done! ${output.total} words → ${OUT_FILE}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
