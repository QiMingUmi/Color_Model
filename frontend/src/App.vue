<script setup lang="ts">
import AppSidebar from './components/AppSidebar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-surface-50">
    <AppSidebar />
    <main class="flex-1 ml-[240px] transition-all duration-300">
      <router-view />
    </main>
  </div>
</template>
