import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import WordView from './views/WordView.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',              component: HomeView },
    { path: '/palabra/:slug', component: WordView },
  ],
})
