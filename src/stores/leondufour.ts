import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LeondufourDB, Word } from '../types'

const LS_KEY = 'leondufour_db'

export const useLeondufourStore = defineStore('leondufour', () => {
  const db      = ref<LeondufourDB | null>(null)
  const loading = ref(false)
  const fetched = ref(false)

  const palabrasOrdenadas = computed<Word[]>(() => {
    if (!db.value?.palabras) return []
    return Object.values(db.value.palabras)
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  })

  function getPalabra(slug: string): Word | null {
    return db.value?.palabras?.[slug] ?? null
  }

  async function cargar(): Promise<void> {
    // Load from localStorage immediately for fast first paint
    if (!db.value) {
      try {
        const stored = localStorage.getItem(LS_KEY)
        if (stored) db.value = JSON.parse(stored) as LeondufourDB
      } catch {
        // localStorage unavailable (private mode) or corrupt data — continue to fetch
      }
    }

    if (fetched.value) return
    if (!db.value) loading.value = true

    try {
      const res = await fetch('/leondufour_data.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      const data = JSON.parse(text) as LeondufourDB

      // Replace cache only if remote version is newer
      if (!db.value?.version || data.version > db.value.version) {
        db.value = data
        try {
          // Guard against localStorage quota being exceeded (~5 MB limit)
          if (text.length < 4_000_000) {
            localStorage.setItem(LS_KEY, text)
          }
        } catch {
          // Storage full — not critical, data is in memory
        }
      }

      fetched.value = true
    } catch (err) {
      // Network error — keep whatever is in db.value from localStorage
      if (import.meta.env.DEV) console.warn('[leondufour] fetch failed:', err)
    } finally {
      loading.value = false
    }
  }

  return { db, loading, palabrasOrdenadas, getPalabra, cargar }
})
