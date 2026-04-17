<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import { getContrastColor } from '../utils/color'
import type { ColorInfo } from '../types'

const props = withDefaults(defineProps<{
  color: ColorInfo
  size?: 'sm' | 'md' | 'lg'
  showInfo?: boolean
  showPercentage?: boolean
}>(), {
  size: 'md',
  showInfo: true,
  showPercentage: false,
})

defineEmits<{ click: [] }>()

const copied = ref(false)

async function handleCopy(e: MouseEvent) {
  e.stopPropagation()
  await navigator.clipboard.writeText(props.color.hex)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

const sizeClasses: Record<string, string> = {
  sm: 'h-10 w-10 rounded-lg text-[10px]',
  md: 'h-16 w-16 rounded-xl text-xs',
  lg: 'h-24 w-full rounded-xl text-sm',
}
</script>

<template>
  <div class="flex flex-col items-center gap-1.5 group" @click="$emit('click')">
    <div
      :class="sizeClasses[size]"
      class="flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg relative"
      :style="{ backgroundColor: color.hex }"
    >
      <button
        @click="handleCopy"
        class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
        :style="{ color: getContrastColor(color.hex) }"
      >
        <Check v-if="copied" :size="14" />
        <Copy v-else :size="14" />
      </button>
      <span
        v-if="showPercentage && color.percentage > 0"
        class="absolute bottom-1 right-1 text-[10px] font-medium px-1 rounded"
        :style="{ color: getContrastColor(color.hex), backgroundColor: 'rgba(0,0,0,0.15)' }"
      >
        {{ color.percentage }}%
      </span>
    </div>
    <div v-if="showInfo" class="text-center">
      <p class="text-xs font-mono font-medium text-surface-700 uppercase">{{ color.hex }}</p>
      <p v-if="size === 'lg'" class="text-[10px] text-surface-500 mt-0.5">
        RGB({{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }})
      </p>
    </div>
  </div>
</template>
