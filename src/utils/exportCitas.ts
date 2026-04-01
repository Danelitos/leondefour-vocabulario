// xlsx-js-style is imported dynamically so it doesn't bloat the initial bundle.
// It loads only when the user actually clicks the export button.
// xlsx-js-style is a fork of SheetJS that adds full cell-style support (borders,
// fonts, fills) — the plain 'xlsx' package silently ignores the `s` property.
import type { CitasCategorizadas } from '../types'

// ── Border helpers ────────────────────────────────────────────────────────────
const THIN = { style: 'thin'   as const }
const MED  = { style: 'medium' as const }

function border(col: number, row: number, totalCols: number, totalRows: number) {
  return {
    top:    row === 1                ? MED : THIN,
    bottom: row === totalRows        ? MED : THIN,
    left:   col === 0               ? MED : THIN,
    right:  col === totalCols - 1   ? MED : THIN,
  }
}

// ── Column layout ─────────────────────────────────────────────────────────────
// A  B         C  D   E  F         G  H   I  J         K  L   M  N          O  P
// N  1 PALABRA P  PT  N  2 PALABRA P  PT  N  3 PALABRA P  PT  N  EVANGELIO  P  PT
const COLS    = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P']
const HEADERS = [
  'N', '1 PALABRA', 'P', 'PT',
  'N', '2 PALABRA', 'P', 'PT',
  'N', '3 PALABRA', 'P', 'PT',
  'N', 'EVANGELIO', 'P', 'PT',
]
const WIDTHS  = [4, 16, 4, 8,  4, 16, 4, 8,  4, 16, 4, 8,  4, 16, 4, 8]

/**
 * Exports categorized citations to an Excel file matching the preparation template.
 *
 * Column mapping:
 *   A-D  → N / 1 PALABRA (Libros)
 *   E-H  → N / 2 PALABRA (Profetas)
 *   I-L  → N / 3 PALABRA (Epístolas)
 *   M-P  → N / EVANGELIO (Evangelios)
 *
 * N columns: single global counter.
 * P and PT columns left blank (for manual scoring).
 */
export async function exportarCitasExcel(
  nombrePalabra: string,
  citas: CitasCategorizadas,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX: any = (await import('xlsx-js-style')).default ?? (await import('xlsx-js-style'))

  const { libros, profetas, epistolas, evangelios } = citas
  const maxData  = Math.max(libros.length, profetas.length, epistolas.length, evangelios.length)
  const dataRows = Math.max(maxData, 1)
  const totalRows = 1 + dataRows   // row 1 = header

  const wb = XLSX.utils.book_new()
  const ws: Record<string, unknown> = {}

  // ── Column widths ─────────────────────────────────────────────────────────
  ws['!cols'] = WIDTHS.map(w => ({ wch: w }))

  // ── Row height: header slightly taller ────────────────────────────────────
  ws['!rows'] = [{ hpt: 22 }]

  // ── Header row (row 1) ────────────────────────────────────────────────────
  HEADERS.forEach((header, ci) => {
    ws[`${COLS[ci]}1`] = {
      v: header,
      t: 's',
      s: {
        font:      { bold: true, sz: 11, name: 'Calibri' },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border:    border(ci, 1, COLS.length, totalRows),
      },
    }
  })

  // ── Data rows ─────────────────────────────────────────────────────────────
  let n = 1   // Global N counter

  for (let row = 2; row <= totalRows; row++) {
    const di = row - 2    // 0-based data index

    COLS.forEach((colLetter, ci) => {
      let val: string | number | undefined

      if (ci === 0  && di < libros.length)     { val = n++ }
      if (ci === 1  && di < libros.length)     { val = libros[di] }
      if (ci === 4  && di < profetas.length)   { val = n++ }
      if (ci === 5  && di < profetas.length)   { val = profetas[di] }
      if (ci === 8  && di < epistolas.length)  { val = n++ }
      if (ci === 9  && di < epistolas.length)  { val = epistolas[di] }
      if (ci === 12 && di < evangelios.length) { val = n++ }
      if (ci === 13 && di < evangelios.length) { val = evangelios[di] }

      ws[`${colLetter}${row}`] = {
        v: val ?? '',
        t: typeof val === 'number' ? 'n' : 's',
        s: { border: border(ci, row, COLS.length, totalRows) },
      }
    })
  }

  ws['!ref'] = `A1:P${totalRows}`

  XLSX.utils.book_append_sheet(wb, ws, 'Hoja1')
  XLSX.writeFile(wb, `${nombrePalabra} - Citas.xlsx`)
}
