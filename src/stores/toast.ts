import { defineStore } from 'pinia'
import { ref } from 'vue'

const TOAST_DURATION = 2600

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const visible = ref(false)
  let _timer: ReturnType<typeof setTimeout> | null = null

  function show(msg: string): void {
    message.value = msg
    visible.value = true
    if (_timer !== null) clearTimeout(_timer)
    _timer = setTimeout(() => {
      visible.value = false
      _timer = null
    }, TOAST_DURATION)
  }

  return { message, visible, show }
})
