<template>
  <RouterView />
  <div id="toast" :class="{ show: toast.visible }">{{ toast.message }}</div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useToastStore } from './stores/toast'

const toast = useToastStore()
</script>
