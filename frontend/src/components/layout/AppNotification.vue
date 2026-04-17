<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'

const appStore = useAppStore()

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const colorMap = {
  success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-[-100%] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-[-100%] opacity-0"
  >
    <div
      v-if="appStore.notification"
      class="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg max-w-md"
      :class="colorMap[appStore.notification.type]"
    >
      <component :is="iconMap[appStore.notification.type]" class="w-5 h-5 shrink-0" />
      <span class="text-sm">{{ appStore.notification.message }}</span>
      <button @click="appStore.notification = null" class="ml-2 shrink-0 hover:opacity-70">
        <X class="w-4 h-4" />
      </button>
    </div>
  </Transition>
</template>
