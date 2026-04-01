import { ref } from 'vue'
import type { Ref } from 'vue'

// Module-level singleton — theme state is shared across all component instances
function _readTheme(): boolean {
  try {
    return localStorage.getItem('theme') === 'dark'
  } catch {
    return false
  }
}

const isDark: Ref<boolean> = ref(_readTheme())

// Apply the persisted theme to the DOM immediately on module load
document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')

export function useTheme() {
  function toggleTheme(): void {
    isDark.value = !isDark.value
    const theme = isDark.value ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // localStorage unavailable — theme still works for the current session
    }
  }

  return { isDark, toggleTheme }
}
