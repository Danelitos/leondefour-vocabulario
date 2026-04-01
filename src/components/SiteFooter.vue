<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="footer-brand">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="4" y1="8" x2="20" y2="8"/></svg>
        León Dufour · v2.0
      </div>
      <div class="footer-links">
        <a
          href="https://www.linkedin.com/in/danel-alonso-egusquiza/"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          Danel Alonso Egusquiza
        </a>
        <button class="footer-link footer-privacy-btn" @click="showPrivacy = true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Política de privacidad
        </button>
      </div>
    </div>
    <p class="footer-attr">
      Contenido basado en el <em>Vocabulario de Teología Bíblica</em> de Xavier Léon-Dufour.
    </p>
  </footer>

  <!-- Privacy modal (position:fixed so it works from anywhere in the DOM) -->
  <div v-if="showPrivacy" class="privacy-backdrop" @click.self="showPrivacy = false">
    <div class="privacy-box">
      <div class="privacy-header">
        <h3>Política de privacidad</h3>
        <button class="privacy-close" @click="showPrivacy = false">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="privacy-body">
        <p><strong>Sin recopilación de datos personales.</strong> Esta aplicación no recoge, almacena ni transmite ningún dato personal.</p>
        <p><strong>Almacenamiento local.</strong> Se usa <code>localStorage</code> únicamente para recordar tu preferencia de tema visual (claro u oscuro). Estos datos nunca salen de tu dispositivo.</p>
        <p><strong>Sin cookies ni rastreo.</strong> No se utilizan cookies, analytics ni ningún servicio de seguimiento de terceros.</p>
        <p><strong>Conexiones externas.</strong> La única conexión externa posible es al abrir una cita en Bible Gateway, acción que tú inicias explícitamente.</p>
        <p><strong>Contenido.</strong> Los artículos están basados en el <em>Vocabulario de Teología Bíblica</em> de Xavier Léon-Dufour, con fines educativos y de consulta personal.</p>
      </div>
      <div class="privacy-footer">
        <button class="btn-ok" @click="showPrivacy = false">Entendido</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const showPrivacy = ref(false)
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border2);
  /* env(safe-area-inset-bottom) adds space for iPhone home indicator */
  padding: 22px 0 max(36px, calc(24px + env(safe-area-inset-bottom)));
  margin-top: 8px;
}
.footer-main {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px; margin-bottom: 8px;
}
.footer-brand {
  display: flex; align-items: center; gap: 7px;
  font-family: 'Neocat', 'Cormorant Garamond', serif;
  font-size: .88rem; color: var(--ink3);
}
.footer-brand svg { width: 13px; height: 13px; color: var(--gold); }
.footer-links { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; row-gap: 8px; }
.footer-link {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: .78rem; color: var(--ink3); text-decoration: none;
  background: none; border: none; cursor: pointer; padding: 0;
  font-family: 'Instrument Sans', sans-serif; transition: color .15s;
}
.footer-link:hover { color: var(--gold); }
.footer-link svg { width: 12px; height: 12px; }
.footer-attr { font-size: .72rem; color: var(--ink3); line-height: 1.5; }

/* Privacy modal */
.privacy-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  z-index: 300;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: fadeIn .15s ease;
}
.privacy-box {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 20px; max-width: 520px; width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
  animation: slideUp .2s ease;
}
.privacy-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px; border-bottom: 1px solid var(--border2);
}
.privacy-header h3 {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 1rem; font-weight: 600; color: var(--ink); margin: 0;
}
.privacy-close {
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  background: var(--bg2); border: none; border-radius: 50%; cursor: pointer;
  color: var(--ink3); transition: all .15s;
}
.privacy-close:hover { background: var(--border); color: var(--ink); }
.privacy-close svg { width: 14px; height: 14px; }
.privacy-body {
  padding: 20px 24px; display: flex; flex-direction: column; gap: 12px;
  max-height: 55vh; overflow-y: auto;
}
.privacy-body p { font-size: .87rem; line-height: 1.7; color: var(--ink2); margin: 0; }
.privacy-body code {
  font-size: .82em; background: var(--bg2); padding: 1px 6px;
  border-radius: 4px; color: var(--ink);
}
.privacy-footer {
  padding: 14px 24px 20px; border-top: 1px solid var(--border2);
  display: flex; justify-content: flex-end;
}
.btn-ok {
  background: var(--gold); color: #fff; border: none;
  border-radius: 100px; padding: 9px 24px;
  font-family: 'Instrument Sans', sans-serif; font-size: .86rem;
  font-weight: 600; cursor: pointer; transition: filter .15s;
}
.btn-ok:hover { filter: brightness(.9); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
