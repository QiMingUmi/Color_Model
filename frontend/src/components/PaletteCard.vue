<script setup lang="ts">
import { ref } from 'vue'
import { MoreVertical, Download, Trash2, Edit } from 'lucide-vue-next'
import type { Palette } from '../types'

defineProps<{ palette: Palette }>()
defineEmits<{ click: [] }>()

const menuOpen = ref(false)
</script>

<template>
  <div
    @click="$emit('click')"
    class="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all duration-300 cursor-pointer group"
  >
    <div class="h-24 flex">
      <div
        v-for="(c, i) in palette.colors"
        :key="i"
        class="h-full transition-all duration-300"
        :style="{ backgroundColor: c.hex, flex: c.percentage || 1 }"
      />
    </div>

    <div class="p-4">
      <div class="flex items-start justify-between">
        <div class="min-w-0">
          <h3 class="font-semibold text-surface-800 text-sm truncate">{{ palette.name }}</h3>
          <p v-if="palette.description" class="text-xs text-surface-500 mt-0.5 line-clamp-1">{{ palette.description }}</p>
        </div>
        <div class="relative">
          <button
            @click.stop="menuOpen = !menuOpen"
            class="p-1 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <MoreVertical :size="16" />
          </button>
          <div v-if="menuOpen" class="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-xl border border-surface-200 py-1 z-10">
            <button class="w-full flex items-center gap-2 px-3 py-2 text-xs text-surface-600 hover:bg-surface-50 transition-colors">
              <Edit :size="14" /> 编辑方案
            </button>
            <button class="w-full flex items-center gap-2 px-3 py-2 text-xs text-surface-600 hover:bg-surface-50 transition-colors">
              <Download :size="14" /> 导出方案
            </button>
            <button class="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 :size="14" /> 删除方案
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-1.5 mt-3 flex-wrap">
        <span
          v-for="tag in palette.tags"
          :key="tag"
          class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-600"
        >
          {{ tag }}
        </span>
      </div>

      <div class="flex items-center gap-2 mt-3">
        <div class="flex -space-x-1">
          <div
            v-for="(c, i) in palette.colors.slice(0, 6)"
            :key="i"
            class="w-5 h-5 rounded-full border-2 border-white"
            :style="{ backgroundColor: c.hex }"
          />
        </div>
        <span class="text-[10px] text-surface-400 ml-auto">{{ palette.colors.length }} 色</span>
      </div>
    </div>
  </div>
</template>
