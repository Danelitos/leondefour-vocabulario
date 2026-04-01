import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const visible = ref(false)
  let _timer = null

  function show(msg) {
    message.value = msg
    visible.value = true
    clearTimeout(_timer)
    _timer = setTimeout(() => { visible.value = false }, 2600)
  }

  return { message, visible, show }
})
