<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNotification from '@/components/layout/AppNotification.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
})
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <AppHeader />
      <main
        class="flex-1 overflow-y-auto p-6"
        :style="{ backgroundColor: 'var(--color-bg-secondary)' }"
      >
        <router-view />
      </main>
    </div>
    <AppNotification />
  </div>
</template>
