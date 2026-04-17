<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Home,
  Pipette,
  PaintBucket,
  Palette,
  Sparkles,
  FolderOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

const route = useRoute()
const collapsed = ref(false)

const navItems = [
  { to: '/', icon: Home, label: '首页概览' },
  { to: '/extract', icon: Pipette, label: '色彩提取' },
  { to: '/colorize', icon: PaintBucket, label: '线稿上色' },
  { to: '/recommend', icon: Sparkles, label: '色彩推荐' },
  { to: '/palettes', icon: FolderOpen, label: '方案管理' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen z-40 flex flex-col bg-surface-950 text-white transition-all duration-300 ease-in-out"
    :class="collapsed ? 'w-[72px]' : 'w-[240px]'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shrink-0">
        <Palette :size="18" class="text-white" />
      </div>
      <span v-if="!collapsed" class="text-lg font-semibold tracking-tight whitespace-nowrap">
        ColorMind
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
        :class="isActive(item.to)
          ? 'bg-primary-600/20 text-primary-300'
          : 'text-surface-400 hover:bg-white/5 hover:text-surface-200'"
      >
        <component :is="item.icon" :size="20" class="shrink-0" />
        <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Settings -->
    <div class="px-3 py-4 border-t border-white/10 space-y-1 shrink-0">
      <RouterLink
        to="/settings"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:bg-white/5 hover:text-surface-200 transition-all"
      >
        <Settings :size="20" class="shrink-0" />
        <span v-if="!collapsed">系统设置</span>
      </RouterLink>
    </div>

    <!-- Collapse Toggle -->
    <button
      @click="collapsed = !collapsed"
      class="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-800 border border-surface-600
             flex items-center justify-center text-surface-400 hover:text-white
             hover:bg-surface-700 transition-all cursor-pointer"
    >
      <ChevronRight v-if="collapsed" :size="14" />
      <ChevronLeft v-else :size="14" />
    </button>
  </aside>
</template>
