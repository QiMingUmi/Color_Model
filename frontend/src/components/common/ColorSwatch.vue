<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

const props = defineProps<{
  hex: string
  percentage?: number
  showInfo?: boolean
  size?: 'sm' | 'md' | 'lg'
}>()

const copied = ref(false)

async function copyHex() {
  try {
    await navigator.clipboard.writeText(props.hex)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // fallback
  }
}

const sizeClasses = {
  sm: 'w-8 h-8 rounded',
  md: 'w-12 h-12 rounded-lg',
  lg: 'w-16 h-16 rounded-xl',
}
</script>

<template>
  <div class="flex items-center gap-3 group">
    <div
      :class="sizeClasses[size || 'md']"
      :style="{ backgroundColor: hex }"
      class="shadow-sm border border-black/10 shrink-0"
    />
    <div v-if="showInfo" class="min-w-0">
      <div class="flex items-center gap-1.5">
        <span class="text-sm font-mono font-medium" :style="{ color: 'var(--color-text)' }">
          {{ hex }}
        </span>
        <button
          @click.stop="copyHex"
          class="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          :style="{ color: 'var(--color-text-secondary)' }"
        >
          <Check v-if="copied" class="w-3.5 h-3.5 text-green-500" />
          <Copy v-else class="w-3.5 h-3.5" />
        </button>
      </div>
      <span
        v-if="percentage !== undefined"
        class="text-xs"
        :style="{ color: 'var(--color-text-secondary)' }"
      >
        {{ percentage.toFixed(1) }}%
      </span>
    </div>
  </div>
</template>
