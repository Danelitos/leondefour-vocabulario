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

      <!-- HERO -->
      <header class="info-hero">
        <div class="info-hero-title">
          <svg class="hero-cross" viewBox="0 0 28 42" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
            <line x1="14" y1="2" x2="14" y2="40"/>
            <line x1="2" y1="13" x2="26" y2="13"/>
          </svg>
          <h1>León <em>Dufour</em></h1>
        </div>
        <p class="info-subtitle">Vocabulario de Teología Bíblica</p>
        <p class="info-tagline">Consulta digital del diccionario teológico de Xavier Léon-Dufour</p>
      </header>

      <!-- ABOUT -->
      <section class="info-section">
        <div class="info-section-label">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Sobre el diccionario
        </div>
        <div class="info-card">
          <p>
            El <em>Vocabulario de Teología Bíblica</em> es una obra de referencia escrita por
            <strong>Xavier Léon-Dufour</strong>, jesuita y exégeta francés (1912–2007), elaborada junto a un equipo
            de teólogos y biblistas. Publicada por primera vez en 1962 y revisada en sucesivas ediciones,
            se ha convertido en uno de los instrumentos de estudio bíblico más utilizados en el mundo
            de habla hispana y en la formación teológica.
          </p>
          <p>
            La obra recoge más de <strong>150 palabras clave</strong> del Antiguo y del Nuevo Testamento —
            términos como <em>Fe</em>, <em>Amor</em>, <em>Alianza</em>, <em>Pascua</em> o <em>Espíritu</em> —
            y desarrolla para cada una de ellas un artículo teológico que traza la evolución del concepto
            a lo largo de toda la Biblia, desde los textos más antiguos del AT hasta la plenitud revelada
            en el NT, con especial atención a las citas bíblicas que sustentan cada idea.
          </p>
          <p>
            Su enfoque es <strong>teológico-bíblico</strong>: no se limita a definir palabras, sino que muestra
            cómo cada concepto crece, se purifica y alcanza su plenitud de sentido dentro de la historia
            de la salvación. Por ello es especialmente útil para la preparación de predicaciones, catequesis,
            retiros y estudio personal de la Escritura.
          </p>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="info-section">
        <div class="info-section-label">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Funcionalidades
        </div>
        <div class="features-grid">

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3>Buscador instantáneo</h3>
            <p>Filtra las más de 150 palabras del vocabulario al instante mientras escribes. También puedes usar el botón «Aleatoria» para descubrir una palabra al azar.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>
            <h3>Síntesis con esquema</h3>
            <p>Cada artículo muestra una síntesis con el esquema de secciones del texto. Toca cualquier apartado para desplazarte directamente a él.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <h3>Artículo teológico completo</h3>
            <p>Lee el artículo completo de cada palabra con el texto original del diccionario. Las citas bíblicas aparecen resaltadas; tócalas para abrirlas en Bible Gateway (RVR1960).</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3>Citas clasificadas</h3>
            <p>Las citas bíblicas de cada palabra están organizadas en cuatro columnas: <strong>Libros</strong>, <strong>Profetas</strong>, <strong>Epístolas</strong> y <strong>Evangelios</strong>. Toca cualquiera para abrirla directamente.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
            </div>
            <h3>Exportar a Excel</h3>
            <p>Descarga las citas de cualquier palabra en un archivo .xlsx con bordes y formato, listo para usarlo en la hoja de preparación de predicaciones.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </div>
            <h3>Modo oscuro</h3>
            <p>Cambia entre modo claro y oscuro en cualquier momento. Tu preferencia se guarda automáticamente para la próxima vez que abras la app.</p>
          </div>

        </div>
      </section>

      <!-- CTA -->
      <div class="info-cta">
        <RouterLink to="/" class="cta-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Explorar el vocabulario
        </RouterLink>
      </div>

      <SiteFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import SiteFooter from '../components/SiteFooter.vue'

const { isDark, toggleTheme } = useTheme()

onMounted(() => { document.title = 'Info · León Dufour' })
</script>

<style scoped>
.wrap   { max-width: 720px; }
.topbar { justify-content: space-between; }

/* Hero */
.info-hero {
  padding: 32px 0 40px;
  text-align: center;
}
.info-hero-title {
  display: flex; align-items: center; justify-content: center;
  gap: 14px; margin-bottom: 6px;
}
.hero-cross {
  height: clamp(1.6rem, 4vw, 2.8rem); width: auto;
  color: var(--gold); flex-shrink: 0;
}
h1 {
  font-family: 'Neocat', 'Cormorant Garamond', serif;
  font-size: clamp(2.4rem, 7vw, 4.2rem);
  font-weight: normal; line-height: 1; color: var(--ink);
  margin: 0;
}
h1 em { font-style: italic; color: var(--gold); }
.info-subtitle {
  font-size: .9rem; color: var(--ink2);
  letter-spacing: .03em; margin-bottom: 10px;
}
.info-tagline {
  font-size: .82rem; color: var(--ink3);
  font-style: italic;
}

/* Sections */
.info-section { margin-bottom: 40px; }
.info-section-label {
  display: flex; align-items: center; gap: 7px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: .7rem; font-weight: 700; letter-spacing: .15em;
  text-transform: uppercase; color: var(--gold);
  margin-bottom: 14px;
}
.info-section-label svg { width: 13px; height: 13px; }

/* About card */
.info-card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 16px; padding: 22px 24px;
  box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; gap: 14px;
}
.info-card p {
  font-size: .9rem; line-height: 1.82; color: var(--ink2); margin: 0;
}
.info-card strong { color: var(--ink); font-weight: 600; }
.info-card em { font-style: italic; color: var(--ink); }

/* Features grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}
.feature-card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 16px; padding: 20px 18px;
  box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; gap: 10px;
  transition: border-color .15s, box-shadow .15s;
}
.feature-card:hover {
  border-color: var(--gold-bdr); box-shadow: var(--shadow);
}
.feature-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--gold-bg); border: 1px solid var(--gold-bdr);
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
}
.feature-icon svg { width: 16px; height: 16px; }
.feature-card h3 {
  font-family: 'Instrument Sans', sans-serif;
  font-size: .88rem; font-weight: 600; color: var(--ink); margin: 0;
}
.feature-card p {
  font-size: .8rem; line-height: 1.68; color: var(--ink2); margin: 0;
}
.feature-card strong { color: var(--ink); }

/* CTA */
.info-cta {
  display: flex; justify-content: center;
  padding: 8px 0 48px;
}
.cta-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--ink); color: var(--bg);
  border: none; border-radius: 100px;
  padding: 13px 28px; font-family: 'Instrument Sans', sans-serif;
  font-size: .9rem; font-weight: 600; text-decoration: none;
  cursor: pointer; transition: all .18s;
  box-shadow: 0 3px 12px rgba(26,23,20,.20);
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,23,20,.25); }
.cta-btn svg { width: 15px; height: 15px; }

/* Mobile */
@media (max-width: 640px) {
  .topbar { gap: 6px; padding-top: 12px; }
  .nav-btn span { display: none; }
  .info-hero { padding: 20px 0 28px; }
  .info-card { padding: 16px 16px; }
  .features-grid { grid-template-columns: 1fr; gap: 10px; }
  .feature-card { padding: 16px 14px; flex-direction: row; align-items: flex-start; gap: 12px; }
  .feature-icon { flex-shrink: 0; }
  .feature-card > div { flex: 1; }
}
</style>
