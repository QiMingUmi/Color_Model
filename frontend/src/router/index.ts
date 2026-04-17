import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ExtractPage from '../pages/ExtractPage.vue'
import ColorizePage from '../pages/ColorizePage.vue'
import RecommendPage from '../pages/RecommendPage.vue'
import PalettesPage from '../pages/PalettesPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/extract', name: 'extract', component: ExtractPage },
    { path: '/colorize', name: 'colorize', component: ColorizePage },
    { path: '/recommend', name: 'recommend', component: RecommendPage },
    { path: '/palettes', name: 'palettes', component: PalettesPage },
    { path: '/settings', name: 'settings', component: SettingsPage },
  ],
})

export default router
