import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const LS_KEY = 'leondufour_db'

export const useLeondufourStore = defineStore('leondufour', () => {
  const db       = ref(null)
  const loading  = ref(false)
  const fetched  = ref(false)

  const palabrasOrdenadas = computed(() => {
    if (!db.value?.palabras) return []
    return Object.values(db.value.palabras)
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  })

  function getPalabra(slug) {
    return db.value?.palabras?.[slug] ?? null
  }

  async function cargar() {
    // Load from localStorage immediately for fast display
    if (!db.value) {
      try {
        const stored = localStorage.getItem(LS_KEY)
        if (stored) db.value = JSON.parse(stored)
      } catch (_) {}
    }

    if (fetched.value) return
    if (!db.value) loading.value = true

    try {
      const res  = await fetch('/leondufour_data.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      const data = JSON.parse(text)

      // Replace cache if remote version is newer (or cache has no version)
      if (!db.value?.version || data.version > db.value.version) {
        db.value = data
        try { localStorage.setItem(LS_KEY, text) } catch (_) {}
      }

      fetched.value = true
    } catch (_) {
      // keep whatever is in db.value from localStorage
    } finally {
      loading.value = false
    }
  }

  return { db, loading, palabrasOrdenadas, getPalabra, cargar }
})
