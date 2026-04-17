<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-12">
    <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
    <p v-if="text" class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">{{ text }}</p>
  </div>
</template>
