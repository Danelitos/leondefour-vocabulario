// xlsx is imported dynamically so it doesn't bloat the initial bundle.
// It loads only when the user actually clicks the export button.
import type * as XLSXType from 'xlsx'
import type { CitasCategorizadas } from '../types'

/**
 * Exports categorized citations to the Excel preparation sheet.
 *
 * Column mapping (mirrors the app's citation tab):
 *   A-D  → N / 1 PALABRA (Libros)
 *   E-H  → N / 2 PALABRA (Profetas)
 *   I-L  → N / 3 PALABRA (Epístolas)
 *   M-P  → N / EVANGELIO (Evangelios)
 *
 * The N columns contain a single global counter that increments
 * from the first Libros citation to the last Evangelios citation.
 */
export async function exportarCitasExcel(
  nombrePalabra: string,
  citas: CitasCategorizadas,
): Promise<void> {
  // Load the template from the public directory
  const res = await fetch('/hoja-preparacion.xlsx')
  if (!res.ok) throw new Error(`No se pudo cargar la plantilla: HTTP ${res.status}`)
  const buffer = await res.arrayBuffer()

  const XLSX: typeof XLSXType = await import('xlsx')

  const wb = XLSX.read(new Uint8Array(buffer), {
    type: 'array',
    cellStyles: true,
    sheetStubs: true,
  })

  const ws = wb.Sheets['Hoja1']
  if (!ws) throw new Error('Hoja "Hoja1" no encontrada en la plantilla')

  const { libros, profetas, epistolas, evangelios } = citas

  // Helper: write a value into a cell, preserving any existing style
  function setCell(col: string, row: number, value: string | number): void {
    const addr = `${col}${row}`
    const existing = ws[addr] as XLSXType.CellObject | undefined
    ws[addr] = {
      ...(existing ?? {}),
      v: value,
      t: typeof value === 'number' ? 'n' : 's',
    }
  }

  let n = 1 // Global counter across all sections

  // ── Section 1: Libros → columns A (N) and B (citation) ──────────────────
  libros.forEach((cita, i) => {
    setCell('A', i + 2, n++)
    setCell('B', i + 2, cita)
  })

  // ── Section 2: Profetas → columns E (N) and F (citation) ─────────────────
  profetas.forEach((cita, i) => {
    setCell('E', i + 2, n++)
    setCell('F', i + 2, cita)
  })

  // ── Section 3: Epístolas → columns I (N) and J (citation) ────────────────
  epistolas.forEach((cita, i) => {
    setCell('I', i + 2, n++)
    setCell('J', i + 2, cita)
  })

  // ── Section 4: Evangelios → columns M (N) and N (citation) ───────────────
  evangelios.forEach((cita, i) => {
    setCell('M', i + 2, n++)
    setCell('N', i + 2, cita)
  })

  // Expand the sheet range if citations exceed the 37 template rows
  const maxRows = Math.max(libros.length, profetas.length, epistolas.length, evangelios.length)
  if (maxRows > 0) {
    ws['!ref'] = `A1:P${maxRows + 1}`
  }

  // Trigger browser download
  XLSX.writeFile(wb, `${nombrePalabra} - Citas.xlsx`)
}
