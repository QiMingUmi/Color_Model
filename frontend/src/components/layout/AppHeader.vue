<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Sun, Moon } from 'lucide-vue-next'

const route = useRoute()
const appStore = useAppStore()
</script>

<template>
  <header
    class="h-14 flex items-center justify-between px-6 border-b"
    :style="{
      backgroundColor: 'var(--color-bg)',
      borderColor: 'var(--color-border)',
    }"
  >
    <h1 class="text-lg font-semibold" :style="{ color: 'var(--color-text)' }">
      {{ route.meta.title }}
    </h1>

    <div class="flex items-center gap-3">
      <button
        @click="appStore.toggleDark"
        class="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        :style="{ color: 'var(--color-text-secondary)' }"
        :title="appStore.isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <Moon v-if="!appStore.isDark" class="w-5 h-5" />
        <Sun v-else class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>
