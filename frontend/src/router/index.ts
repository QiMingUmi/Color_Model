import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/extract',
    },
    {
      path: '/extract',
      name: 'extract',
      component: () => import('@/views/ExtractView.vue'),
      meta: { title: '色彩提取' },
    },
    {
      path: '/palettes',
      name: 'palettes',
      component: () => import('@/views/PalettesView.vue'),
      meta: { title: '方案管理' },
    },
    {
      path: '/colorize',
      name: 'colorize',
      component: () => import('@/views/ColorizeView.vue'),
      meta: { title: '线稿上色' },
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import('@/views/RecommendView.vue'),
      meta: { title: '色彩推荐' },
    },
  ],
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || 'Color Model'} - 智能色彩系统`
})

export default router
