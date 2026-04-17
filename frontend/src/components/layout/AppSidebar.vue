<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  Palette,
  Pipette,
  PaintBucket,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-vue-next'

const route = useRoute()
const appStore = useAppStore()

const navItems = [
  { path: '/extract', label: '色彩提取', icon: Pipette },
  { path: '/palettes', label: '方案管理', icon: Palette },
  { path: '/colorize', label: '线稿上色', icon: PaintBucket },
  { path: '/recommend', label: '色彩推荐', icon: Sparkles },
]
</script>

<template>
  <aside
    class="h-screen flex flex-col transition-all duration-300 border-r"
    :class="appStore.sidebarCollapsed ? 'w-16' : 'w-56'"
    :style="{
      backgroundColor: 'var(--color-sidebar-bg)',
      borderColor: 'var(--color-border)',
    }"
  >
    <div class="flex items-center justify-between p-4 border-b" :style="{ borderColor: 'var(--color-border)' }">
      <div v-if="!appStore.sidebarCollapsed" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <Palette class="w-5 h-5 text-white" />
        </div>
        <span class="font-bold text-white text-sm">Color Model</span>
      </div>
      <button
        @click="appStore.toggleSidebar"
        class="p-1 rounded hover:bg-white/10 transition-colors"
        :style="{ color: 'var(--color-sidebar-text)' }"
      >
        <PanelLeftClose v-if="!appStore.sidebarCollapsed" class="w-5 h-5" />
        <PanelLeftOpen v-else class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-1 py-4">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all duration-200 group"
        :class="
          route.path === item.path
            ? 'bg-indigo-500/20 text-indigo-400'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        "
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span v-if="!appStore.sidebarCollapsed" class="text-sm font-medium">
          {{ item.label }}
        </span>
      </router-link>
    </nav>

    <div class="p-4 border-t" :style="{ borderColor: 'var(--color-border)' }">
      <div v-if="!appStore.sidebarCollapsed" class="text-xs text-slate-500">
        v0.1.0 MVP
      </div>
    </div>
  </aside>
</template>
