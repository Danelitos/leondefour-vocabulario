<template>
  <div class="page">
    <div class="wrap">

      <!-- TOPBAR -->
      <div class="topbar">
        <RouterLink to="/info" class="nav-btn" title="Información de la app">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span>Info</span>
        </RouterLink>
        <button class="nav-btn" @click="toggleTheme">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="isDark"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></template>
            <template v-else><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></template>
          </svg>
          <span>{{ isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
        </button>
      </div>


      <!-- HEADER -->
      <header class="site-header">
        <div class="header-title-row">
          <svg class="header-cross-svg" viewBox="0 0 28 42" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
            <line x1="14" y1="2" x2="14" y2="40"/>
            <line x1="2" y1="13" x2="26" y2="13"/>
          </svg>
          <h1>León <em>Dufour</em></h1>
        </div>
        <p class="header-sub">Vocabulario de Teología Bíblica</p>
      </header>

      <!-- SEARCH + FILTERS -->
      <div class="search-area">
        <div class="search-wrap">
          <input
            class="search-input"
            v-model="query"
            type="text"
            placeholder="Buscar palabra… ej: Amor, Fe, Pascua…"
            autocomplete="off"
          >
          <span class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
        </div>
        <div class="filter-row">
          <span class="word-count">
            <template v-if="store.db">
              <strong>{{ palabrasMostradas.length }}</strong>
              {{ ` de ${store.palabrasOrdenadas.length} palabras` }}
            </template>
          </span>
          <div class="filter-pills">
            <button class="filter-pill" @click="palabraAleatoria" title="Palabra aleatoria">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
              Aleatoria
            </button>
          </div>
        </div>
      </div>

      <!-- WORD GRID -->
      <div class="word-grid">
        <template v-if="store.loading">
          <div class="word-empty">
            <div class="loader"></div>
            <span>Cargando vocabulario…</span>
          </div>
        </template>
        <template v-else-if="!palabrasMostradas.length">
          <div class="word-empty">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            {{ `No se encontró "${query}"` }}
          </div>
        </template>
        <div
          v-for="(p, i) in palabrasMostradas"
          :key="p.slug"
          class="word-card-wrap"
          :style="{ animationDelay: `${Math.min(i, 30) * 0.02}s` }"
        >
          <RouterLink :to="`/palabra/${p.slug}`" class="word-card">
            <span class="word-card-name">{{ p.nombre }}</span>
            <span v-if="p.citas?.length" class="word-card-citas">{{ p.citas.length }} citas</span>
          </RouterLink>
        </div>
      </div>

      <SiteFooter />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useLeondufourStore } from '../stores/leondufour'
import { useTheme } from '../composables/useTheme'
import SiteFooter from '../components/SiteFooter.vue'
import type { Word } from '../types'

const store  = useLeondufourStore()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const query = ref('')

const palabrasMostradas = computed<Word[]>(() => {
  let lista = store.palabrasOrdenadas
  const q = query.value.trim().toLowerCase()
  if (q) lista = lista.filter((p: Word) => p.nombre.toLowerCase().includes(q))
  return lista
})

function palabraAleatoria(): void {
  const lista = store.palabrasOrdenadas
  if (!lista.length) return
  const p = lista[Math.floor(Math.random() * lista.length)]
  void router.push(`/palabra/${p.slug}`)
}

onMounted(() => { void store.cargar() })
</script>

<style scoped>
.wrap        { max-width: 860px; }
.topbar      { justify-content: flex-end; }
.site-header { padding: 12px 0 0; }
.site-header { text-align: center; }
.header-title-row { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 6px; }
.header-cross-svg { height: clamp(1.8rem, 5vw, 3.2rem); width: auto; color: var(--gold); flex-shrink: 0; }
h1           { font-size: clamp(2.6rem, 8vw, 5rem); margin-bottom: 0; }
.header-sub  { font-size: .95rem; color: var(--ink2); margin-bottom: 32px; letter-spacing: .01em; }

/* Search area */
.search-area   { margin-bottom: 8px; }
.search-wrap   { position: relative; margin-bottom: 10px; }
.search-input {
  width: 100%; padding: 13px 46px 13px 18px;
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 100px; font-family: 'Instrument Sans', sans-serif;
  font-size: .95rem; color: var(--ink); outline: none;
  transition: border-color .18s, box-shadow .18s; box-shadow: var(--shadow-sm);
}
.search-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(181,133,26,.12); }
.search-input::placeholder { color: var(--ink3); }
.search-icon {
  position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  color: var(--ink3); pointer-events: none;
}
.search-icon svg { width: 16px; height: 16px; }

/* Filter row */
.filter-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; flex-wrap: wrap; gap: 8px;
}
.word-count { font-size: .8rem; color: var(--ink3); }
.word-count strong { color: var(--ink); }
.filter-pills { display: flex; gap: 6px; }
.filter-pill {
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 100px; font-size: .75rem; font-weight: 500;
  color: var(--ink2); cursor: pointer; transition: all .15s;
  font-family: 'Instrument Sans', sans-serif;
}
.filter-pill:hover { color: var(--ink); border-color: var(--ink3); }
.filter-pill svg { width: 12px; height: 12px; }

/* Word grid */
.word-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px; padding-bottom: 48px;
}
.word-card-wrap {
  position: relative;
  animation: cardIn .3s cubic-bezier(.34,1.4,.64,1) both;
}
.word-card {
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 6px; padding: 14px 16px;
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 14px; cursor: pointer; text-decoration: none;
  transition: border-color .15s, box-shadow .15s, transform .15s, background .25s;
  box-shadow: var(--shadow-sm); width: 100%; height: 100%;
}
.word-card:hover {
  border-color: var(--gold-bdr); box-shadow: var(--shadow);
  transform: translateY(-2px); background: var(--gold-bg);
}
.word-card-name {
  font-family: 'Neocat', 'Cormorant Garamond', serif;
  font-size: 1.05rem; font-weight: normal; color: var(--ink);
  line-height: 1.2; transition: color .15s;
  word-break: break-word; hyphens: auto;
}
.word-card:hover .word-card-name { color: var(--gold); }
.word-card-citas {
  font-size: .68rem; font-weight: 600;
  background: var(--bg2); color: var(--ink3);
  border-radius: 100px; padding: 2px 8px;
  transition: background .15s, color .15s;
}
.word-card:hover .word-card-citas { background: rgba(181,133,26,.15); color: var(--gold); }

.word-empty {
  grid-column: 1 / -1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px;
  padding: 48px 20px; color: var(--ink3); font-size: .9rem; text-align: center;
}
.word-empty svg    { width: 36px; height: 36px; opacity: .3; }
.loader {
  width: 28px; height: 28px; border: 2px solid var(--border);
  border-top-color: var(--gold); border-radius: 50%;
  animation: spin .7s linear infinite;
}


@keyframes cardIn {
  from { opacity: 0; transform: translateY(10px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  /* Topbar */
  .topbar { gap: 6px; padding-top: 12px; }
  .nav-btn span { display: none; }

  /* Header */
  .header-cross-svg { height: 1.6rem; }
  h1 { font-size: clamp(2rem, 9vw, 2.8rem); }
  .header-sub { font-size: .88rem; margin-bottom: 22px; }

  /* Search: font-size ≥16px prevents iOS auto-zoom on focus */
  .search-input { font-size: 16px; padding: 12px 42px 12px 16px; }

  /* Grid: 2 columns fixed on small screens */
  .word-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding-bottom: 32px;
  }

  /* Cards: slightly more compact */
  .word-card { padding: 12px 14px; border-radius: 12px; }
  .word-card-name { font-size: .95rem; }

  /* Stats strip wrap */
  .stats-strip { flex-wrap: wrap; border-radius: 14px; }
}

@media (max-width: 400px) {
  h1 { font-size: 1.9rem; }
  .word-card { padding: 10px 12px; }
}
</style>
