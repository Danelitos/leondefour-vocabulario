<template>
  <RouterView />
  <div id="toast" :class="{ show: toast.visible }">{{ toast.message }}</div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useToastStore } from './stores/toast.js'

const toast = useToastStore()
</script>
