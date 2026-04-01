import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WordView from './views/WordView.vue'

// Only allow slugs made of word-characters, hyphens and spaces (URL-encoded)
const VALID_SLUG = /^[a-z0-9_-]+$/i

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/palabra/:slug',
      component: WordView,
      beforeEnter(to) {
        const slug = String(to.params.slug)
        if (!VALID_SLUG.test(slug)) return { path: '/' }
      },
    },
  ],
})
