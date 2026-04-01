<template>
  <div class="page">
    <div class="wrap">

      <!-- TOPBAR -->
      <div class="topbar">
        <RouterLink to="/" class="nav-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          <span>Vocabulario</span>
        </RouterLink>
        <button class="nav-btn" @click="toggleTheme">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <template v-if="isDark"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></template>
            <template v-else><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></template>
          </svg>
          <span>{{ isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
        </button>
      </div>

      <!-- LOADING -->
      <div v-if="store.loading" class="state-box" style="margin-top:40px">
        <div class="loader"></div>
        <p>Cargando…</p>
      </div>

      <!-- NOT FOUND -->
      <div v-else-if="!palabra" class="state-box" style="margin-top:40px">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>Palabra no encontrada.<br><RouterLink to="/" style="color:var(--gold)">Volver al vocabulario</RouterLink></p>
      </div>

      <!-- CONTENT -->
      <div v-else>

        <!-- COMBINED STICKY HEADER — title left, tabs right -->
        <div class="sticky-nav">
          <h2 class="card-word">{{ palabra.nombre }}</h2>
          <div class="sticky-tabs">
            <button
              class="sticky-tab"
              :class="{ active: tabActual === 'texto' }"
              @click="tabActual = 'texto'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Artículo
            </button>
            <button
              class="sticky-tab"
              :class="{ active: tabActual === 'citas' }"
              @click="tabActual = 'citas'"
              :disabled="!nCitas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Citas
              <span v-if="nCitas" class="tab-badge">{{ nCitas }}</span>
            </button>
          </div>
        </div>

        <!-- ARTICLE TEXT PANEL -->
        <div v-show="tabActual === 'texto'" class="text-section">

          <!-- SÍNTESIS -->
          <div v-if="sintesis.length" class="sintesis-card">
            <div class="sintesis-title-row">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              Síntesis
            </div>
            <p class="sintesis-intro">Esquema de la palabra "{{ palabra.nombre }}":</p>
            <nav class="sintesis-outline">
              <div v-for="sec in sintesis" :key="sec.id" :class="['sintesis-sec', `sintesis-sec--lv${sec.level}`]">
                <button :class="['sintesis-sec-btn', `sintesis-sec-btn--lv${sec.level}`]" @click="scrollToSection(sec.id)">
                  {{ sec.titulo }}
                </button>
                <ul v-if="sec.items.length" class="sintesis-items">
                  <li v-for="item in sec.items" :key="item.id">
                    <button class="sintesis-item-btn" @click="scrollToSection(item.id)">{{ item.texto }}</button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          <!-- ARTICLE TEXT -->
          <div v-if="palabra.texto" class="article-text" v-html="textoHTML" @click="handleCitaClick" />
          <div v-else class="no-texto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>Este artículo no pudo descargarse del diccionario.</p>
          </div>
        </div>

        <!-- CITAS PANEL -->
        <div v-show="tabActual === 'citas'" class="citas-section">
          <div v-if="!nCitas" class="state-box" style="padding:32px">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>No hay citas para esta palabra</p>
          </div>
          <template v-else>
            <div class="citas-toolbar">
              <p class="citas-intro">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Toca cualquier cita para abrirla en Bible Gateway (RVR1960)
              </p>
              <button class="export-btn" :disabled="exportando" @click="exportarExcel" title="Exportar citas a Excel">
                <svg v-if="exportando" class="export-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
                {{ exportando ? 'Exportando…' : 'Exportar Excel' }}
              </button>
            </div>
            <div class="citas-columnas">

              <div v-if="citasCat.libros.length" class="citas-col">
                <div class="col-header col-libros">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Libros
                  <span class="col-count">{{ citasCat.libros.length }}</span>
                </div>
                <div class="col-chips">
                  <button v-for="cita in citasCat.libros" :key="cita" class="cita-chip" @click="abrirCita(cita)">{{ cita }}</button>
                </div>
              </div>

              <div v-if="citasCat.profetas.length" class="citas-col">
                <div class="col-header col-profetas">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Profetas
                  <span class="col-count">{{ citasCat.profetas.length }}</span>
                </div>
                <div class="col-chips">
                  <button v-for="cita in citasCat.profetas" :key="cita" class="cita-chip" @click="abrirCita(cita)">{{ cita }}</button>
                </div>
              </div>

              <div v-if="citasCat.epistolas.length" class="citas-col">
                <div class="col-header col-epistolas">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Epístolas
                  <span class="col-count">{{ citasCat.epistolas.length }}</span>
                </div>
                <div class="col-chips">
                  <button v-for="cita in citasCat.epistolas" :key="cita" class="cita-chip" @click="abrirCita(cita)">{{ cita }}</button>
                </div>
              </div>

              <div v-if="citasCat.evangelios.length" class="citas-col">
                <div class="col-header col-evangelios">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
                  Evangelios
                  <span class="col-count">{{ citasCat.evangelios.length }}</span>
                </div>
                <div class="col-chips">
                  <button v-for="cita in citasCat.evangelios" :key="cita" class="cita-chip" @click="abrirCita(cita)">{{ cita }}</button>
                </div>
              </div>

            </div>
          </template>
        </div>

        <!-- PREV / NEXT NAVIGATION -->
        <div class="word-nav" v-if="prevPalabra || nextPalabra">
          <RouterLink v-if="prevPalabra" :to="`/palabra/${prevPalabra.slug}`" class="nav-word-btn nav-prev">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            <span>{{ prevPalabra.nombre }}</span>
          </RouterLink>
          <div v-else class="nav-word-spacer"></div>
          <RouterLink v-if="nextPalabra" :to="`/palabra/${nextPalabra.slug}`" class="nav-word-btn nav-next">
            <span>{{ nextPalabra.nombre }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </RouterLink>
          <div v-else class="nav-word-spacer"></div>
        </div>

      </div>

      <!-- FOOTER — always visible -->
      <SiteFooter />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useLeondufourStore } from '../stores/leondufour'
import { useTheme } from '../composables/useTheme'
import {
  decodeEntities, resaltarCitas, categorizarCitas, extraerSintesis,
} from '../utils/leondufour'
import { exportarCitasExcel } from '../utils/exportCitas'
import SiteFooter from '../components/SiteFooter.vue'
import type { Word } from '../types'

const route  = useRoute()
const store  = useLeondufourStore()
const { isDark, toggleTheme } = useTheme()

const tabActual = ref<'texto' | 'citas'>('texto')

const palabra  = computed<Word | null>(() => store.getPalabra(String(route.params.slug)))
const nCitas   = computed<number>(() => palabra.value?.citas?.length ?? 0)
const citasCat = computed(() => categorizarCitas(palabra.value?.citas ?? []))
const sintesis = computed(() => extraerSintesis(palabra.value?.texto))

// v-html is safe: resaltarCitas() runs escapeHTML() on all user-facing text
// before constructing the HTML string. Only trusted span/h3/p tags are injected.
const textoHTML = computed<string>(() => {
  if (!palabra.value?.texto) return ''
  const decoded = decodeEntities(palabra.value.texto)
  return resaltarCitas(decoded, palabra.value.citas ?? [])
})

const prevPalabra = computed<Word | null>(() => {
  const lista = store.palabrasOrdenadas
  const idx   = lista.findIndex((p: Word) => p.slug === route.params.slug)
  return idx > 0 ? lista[idx - 1] : null
})
const nextPalabra = computed<Word | null>(() => {
  const lista = store.palabrasOrdenadas
  const idx   = lista.findIndex((p: Word) => p.slug === route.params.slug)
  return idx !== -1 && idx < lista.length - 1 ? lista[idx + 1] : null
})

watch(palabra, p => {
  document.title = p ? `${p.nombre} · León Dufour` : 'León Dufour'
}, { immediate: true })

watch(() => route.params.slug, () => {
  tabActual.value = 'texto'
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
})

function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function abrirCita(cita: string): void {
  window.open(
    `https://www.biblegateway.com/passage/?search=${encodeURIComponent(cita)}&version=RVR1960`,
    '_blank',
    'noopener,noreferrer'
  )
}

function handleCitaClick(e: MouseEvent): void {
  const span = (e.target as Element).closest('.cita-inline')
  if (span instanceof HTMLElement && span.dataset.cita) {
    abrirCita(span.dataset.cita)
  }
}

const exportando = ref(false)

async function exportarExcel(): Promise<void> {
  if (!palabra.value || exportando.value) return
  exportando.value = true
  try {
    await exportarCitasExcel(palabra.value.nombre, citasCat.value)
  } catch (err) {
    if (import.meta.env.DEV) console.error('[export]', err)
    alert('No se pudo exportar el Excel. Inténtalo de nuevo.')
  } finally {
    exportando.value = false
  }
}

onMounted(() => { void store.cargar() })
</script>

<style scoped>
.wrap   { max-width: 860px; }
.topbar { justify-content: space-between; }

/* Combined sticky header */
.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  /* Same gradient as body — background-attachment:fixed uses viewport coords
     so it lines up perfectly. No animation with transform (breaks fixed bg). */
  background-color: var(--bg);
  background-image:
    radial-gradient(ellipse 70% 50% at 10% 15%, rgba(181,133,26,.08) 0%, transparent 55%),
    radial-gradient(ellipse 50% 70% at 90% 85%, rgba(31,107,71,.06) 0%, transparent 50%);
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-bottom: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  margin-bottom: 24px;
  margin-top: 4px;
}
.card-word {
  font-family: 'Neocat', 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 4vw, 2.6rem); font-weight: normal;
  color: var(--ink); line-height: 1.1;
  min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sticky-tabs { display: flex; gap: 4px; flex-shrink: 0; }
.sticky-tab {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 100px;
  border: 1.5px solid var(--border); background: var(--surface);
  font-family: 'Instrument Sans', sans-serif; font-size: .8rem;
  font-weight: 600; color: var(--ink3); cursor: pointer;
  transition: all .15s; white-space: nowrap;
}
.sticky-tab:disabled { opacity: .4; cursor: default; }
.sticky-tab svg { width: 13px; height: 13px; }
.sticky-tab:not(:disabled):hover { color: var(--ink); border-color: var(--ink3); }
.sticky-tab.active { color: var(--gold); border-color: var(--gold-bdr); background: var(--gold-bg); }
.tab-badge {
  font-size: .65rem; font-weight: 700;
  background: var(--gold); color: #fff;
  border-radius: 100px; padding: 1px 6px;
}

/* Síntesis card */
.sintesis-card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 16px; padding: 18px 20px 20px;
  margin-bottom: 32px; box-shadow: var(--shadow-sm);
}
.sintesis-title-row {
  display: flex; align-items: center; gap: 7px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: .72rem; font-weight: 700; letter-spacing: .14em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 6px;
}
.sintesis-title-row svg { width: 13px; height: 13px; flex-shrink: 0; }
.sintesis-intro {
  font-size: .82rem; color: var(--ink3); margin-bottom: 14px; font-style: italic;
}
.sintesis-outline { display: flex; flex-direction: column; gap: 8px; }
.sintesis-sec { display: flex; flex-direction: column; gap: 3px; }

/* Indentation by level */
.sintesis-sec--lv1 { /* no indent — top level (AT/NT) */ }
.sintesis-sec--lv2 { padding-left: 14px; }
.sintesis-sec--lv3 { padding-left: 28px; }

/* Base button */
.sintesis-sec-btn {
  text-align: left; background: none; border: none; cursor: pointer; padding: 0;
  font-family: 'Instrument Sans', sans-serif;
  color: var(--gold); transition: opacity .15s;
}
.sintesis-sec-btn:hover { opacity: .7; text-decoration: underline; }

/* Size per level */
.sintesis-sec-btn--lv1 { font-size: .86rem; font-weight: 800; letter-spacing: .05em; }
.sintesis-sec-btn--lv2 { font-size: .78rem; font-weight: 700; letter-spacing: .04em; }
.sintesis-sec-btn--lv3 { font-size: .74rem; font-weight: 600; letter-spacing: .02em; opacity: .85; }
.sintesis-items {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 2px;
}
.sintesis-items li {
  font-size: .82rem; color: var(--ink2); padding-left: 16px;
  position: relative; line-height: 1.5;
}
.sintesis-items li::before {
  content: '·'; position: absolute; left: 5px; color: var(--ink3);
}
.sintesis-item-btn {
  background: none; border: none; cursor: pointer; padding: 0;
  font-size: inherit; color: inherit; text-align: left;
  font-family: inherit; line-height: inherit;
  transition: color .15s;
}
.sintesis-item-btn:hover { color: var(--gold); text-decoration: underline; }

/* Article text */
.text-section { margin-bottom: 40px; }
.article-text {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.06rem; line-height: 1.9; color: var(--ink);
}
.article-text :deep(p) { margin-bottom: 1.25em; }
.article-text :deep(.article-section) {
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 700; letter-spacing: .18em;
  text-transform: uppercase; color: var(--gold);
  display: flex; align-items: center; gap: 10px;
  scroll-margin-top: 96px;
}
.article-text :deep(.article-section::after) {
  content: ''; flex: 1; height: 1px; background: var(--gold-bdr);
}
/* Level 1 (AT/NT): largest, most space above */
.article-text :deep(.article-section--lv1) {
  font-size: .76rem; letter-spacing: .22em;
  margin: 3.2em 0 1.2em;
}
/* Level 2 (Roman numerals): default size */
.article-text :deep(.article-section--lv2) {
  font-size: .68rem; letter-spacing: .18em;
  margin: 2.4em 0 1em;
}
/* Level 3 (numbered as sections): smallest */
.article-text :deep(.article-section--lv3) {
  font-size: .62rem; letter-spacing: .14em;
  margin: 2em 0 .8em; opacity: .9;
}
.article-text :deep(.article-num) {
  font-style: italic; color: var(--ink2); font-size: .95rem; margin-bottom: .8em;
  scroll-margin-top: 96px;
}
.article-text :deep(.cita-inline) {
  background: var(--gold-bg); color: var(--gold);
  border-radius: 4px; padding: 1px 5px;
  font-weight: 600; font-size: .85em;
  cursor: pointer; transition: background .12s; white-space: nowrap;
  font-family: 'Instrument Sans', sans-serif;
}
.article-text :deep(.cita-inline:hover) { background: var(--gold-bdr); text-decoration: underline; }

.no-texto {
  display: flex; flex-direction: column; align-items: center;
  padding: 40px 20px; gap: 12px; color: var(--ink3);
  font-size: .88rem; text-align: center;
}
.no-texto svg { width: 36px; height: 36px; opacity: .3; }

/* Citations */
.citas-section { margin-bottom: 40px; }
.citas-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 18px; flex-wrap: wrap;
}
.citas-intro {
  font-size: .76rem; color: var(--ink3); margin-bottom: 0;
  display: flex; align-items: center; gap: 6px;
}
.citas-intro svg { width: 13px; height: 13px; flex-shrink: 0; }
.export-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 100px; cursor: pointer;
  font-size: .74rem; font-weight: 600; font-family: 'Instrument Sans', sans-serif;
  background: #1D6B3A; color: #fff; border: none;
  transition: background .15s, opacity .15s;
  white-space: nowrap; flex-shrink: 0;
}
.export-btn:hover:not(:disabled) { background: #175830; }
.export-btn:disabled { opacity: .6; cursor: not-allowed; }
.export-btn svg { width: 13px; height: 13px; flex-shrink: 0; }
@keyframes spin-slow { to { transform: rotate(360deg); } }
.export-spin { animation: spin-slow .9s linear infinite; }
.citas-columnas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 18px;
}
.citas-col { display: flex; flex-direction: column; gap: 6px; }
.col-header {
  display: flex; align-items: center; gap: 6px;
  font-size: .68rem; font-weight: 700; letter-spacing: .12em;
  text-transform: uppercase; padding-bottom: 7px; border-bottom: 2px solid;
}
.col-header svg { width: 12px; height: 12px; flex-shrink: 0; }
.col-libros    { color: #B5851A; border-color: rgba(181,133,26,.3);  --col-c: #B5851A; }
.col-profetas  { color: #7C22C2; border-color: rgba(124,34,194,.25); --col-c: #7C22C2; }
.col-epistolas { color: #1D52C4; border-color: rgba(29,82,196,.25);  --col-c: #1D52C4; }
.col-evangelios{ color: #1F6B47; border-color: rgba(31,107,71,.25);  --col-c: #1F6B47; }

.col-header .col-count {
  margin-left: auto; font-size: .64rem; font-weight: 700;
  background: var(--col-c); color: #fff;
  border-radius: 100px; padding: 1px 7px;
}

.col-chips { display: flex; flex-direction: column; gap: 4px; }
.cita-chip {
  text-align: left; background: var(--surface2); border: 1px solid var(--border2);
  border-radius: 7px; padding: 5px 10px; font-size: .78rem;
  font-weight: 500; color: var(--ink2); cursor: pointer;
  transition: all .13s; font-family: 'Instrument Sans', sans-serif;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.cita-chip:hover { background: var(--gold-bg); border-color: var(--gold-bdr); color: var(--gold); }

/* State boxes */
.state-box {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 48px 20px;
  color: var(--ink3); gap: 14px; text-align: center;
}
.state-box svg { width: 44px; height: 44px; opacity: .35; }
.state-box p   { font-size: .88rem; line-height: 1.6; }
.loader {
  width: 30px; height: 30px; border: 2.5px solid var(--border);
  border-top-color: var(--gold); border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Prev / Next navigation */
.word-nav {
  display: flex; justify-content: space-between; align-items: center;
  gap: 12px; padding: 24px 0 40px;
  border-top: 1px solid var(--border2); margin-top: 12px;
}
.nav-word-spacer { flex: 1; }
.nav-word-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 100px; padding: 9px 16px;
  font-size: .8rem; font-weight: 500; color: var(--ink2);
  text-decoration: none; transition: all .18s; box-shadow: var(--shadow-sm);
  max-width: 200px; overflow: hidden;
}
.nav-word-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
.nav-word-btn span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nav-word-btn:hover { color: var(--ink); border-color: var(--gold-bdr); box-shadow: var(--shadow); }

/* ── MOBILE ────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  /* Topbar */
  .topbar { gap: 6px; padding-top: 12px; }
  .nav-btn span { display: none; }

  /* Sticky nav: let title + tabs sit comfortably */
  .sticky-nav {
    padding: 10px 0;
    gap: 10px;
    margin-bottom: 16px;
  }
  .card-word { font-size: clamp(1.2rem, 5vw, 1.7rem); }
  .sticky-tabs { gap: 4px; }
  .sticky-tab {
    padding: 8px 12px;
    min-height: 44px; /* accessible touch target */
  }
  .sticky-tab span:not(.tab-badge) { display: none; }

  /* Síntesis: less indentation, tighter padding */
  .sintesis-card { padding: 14px 14px 16px; }
  .sintesis-sec--lv2 { padding-left: 10px; }
  .sintesis-sec--lv3 { padding-left: 20px; }

  /* Article text: slightly smaller, comfortable line-height */
  .article-text { font-size: .97rem; line-height: 1.82; }

  /* Citas toolbar: stack vertically on mobile */
  .citas-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  /* Export button: full width, taller touch target */
  .export-btn {
    width: 100%;
    justify-content: center;
    padding: 11px 16px;
    font-size: .82rem;
    min-height: 44px;
  }

  /* Citas grid: 2 columns */
  .citas-columnas { grid-template-columns: repeat(2, 1fr); gap: 14px; }

  /* Chips: bigger touch target */
  .cita-chip {
    padding: 8px 10px;
    font-size: .8rem;
    min-height: 40px;
    white-space: normal; /* wrap long citations instead of clipping */
    word-break: break-word;
  }

  /* Prev/next nav */
  .word-nav { padding: 16px 0 24px; gap: 8px; }
  .nav-word-btn {
    max-width: 46%;
    padding: 10px 12px;
    font-size: .75rem;
    min-height: 44px;
  }
}

/* ── VERY SMALL PHONES (≤400px) ────────────────────────────── */
@media (max-width: 400px) {
  .card-word { font-size: 1.15rem; }
  /* Single column for citations on tiny screens */
  .citas-columnas { grid-template-columns: 1fr; }
  .sintesis-card { padding: 12px 12px 14px; }
}
</style>
