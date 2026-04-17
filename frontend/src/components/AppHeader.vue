<script setup lang="ts">
import { ref } from 'vue'
import { Search, Sun, Moon, Bell } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle?: string
}>()

const darkMode = ref(false)
</script>

<template>
  <header class="h-16 border-b border-surface-200 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
    <div>
      <h1 class="text-lg font-semibold text-surface-900">{{ title }}</h1>
      <p v-if="subtitle" class="text-xs text-surface-500 -mt-0.5">{{ subtitle }}</p>
    </div>

    <div class="flex items-center gap-2">
      <div class="relative hidden sm:block">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="搜索功能..."
          class="pl-9 pr-4 py-2 w-56 rounded-lg bg-surface-100 border border-surface-200
                 text-sm text-surface-700 placeholder-surface-400
                 focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400 transition-all"
        />
      </div>

      <button class="p-2 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-surface-700 transition-colors relative">
        <Bell :size="18" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <button
        @click="darkMode = !darkMode"
        class="p-2 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-surface-700 transition-colors"
      >
        <Sun v-if="darkMode" :size="18" />
        <Moon v-else :size="18" />
      </button>

      <div class="ml-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
        U
      </div>
    </div>
  </header>
</template>
