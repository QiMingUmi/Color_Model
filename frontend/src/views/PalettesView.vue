<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { listPalettes, deletePalette, getPalette, exportPalette } from '@/api/palettes'
import type { PaletteListItem, Palette } from '@/types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ColorSwatch from '@/components/common/ColorSwatch.vue'
import { Search, Trash2, Download, Eye, X } from 'lucide-vue-next'

const appStore = useAppStore()

const palettes = ref<PaletteListItem[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedPalette = ref<Palette | null>(null)
const showDetail = ref(false)

async function loadPalettes() {
  try {
    loading.value = true
    palettes.value = await listPalettes({
      search: searchQuery.value || undefined,
    })
  } catch {
    appStore.showNotification('error', '加载方案列表失败')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('确定要删除这个色彩方案吗？')) return
  try {
    await deletePalette(id)
    appStore.showNotification('success', '方案已删除')
    await loadPalettes()
  } catch {
    appStore.showNotification('error', '删除失败')
  }
}

async function handleView(id: number) {
  try {
    selectedPalette.value = await getPalette(id)
    showDetail.value = true
  } catch {
    appStore.showNotification('error', '加载方案详情失败')
  }
}

async function handleExport(id: number) {
  try {
    const data = await exportPalette(id, 'json')
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `palette_${id}.json`
    a.click()
    URL.revokeObjectURL(url)
    appStore.showNotification('success', '导出成功')
  } catch {
    appStore.showNotification('error', '导出失败')
  }
}

onMounted(loadPalettes)
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Search -->
    <div class="rounded-xl border p-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" :style="{ color: 'var(--color-text-secondary)' }" />
          <input
            v-model="searchQuery"
            @keyup.enter="loadPalettes"
            class="w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
            placeholder="搜索色彩方案..."
          />
        </div>
        <button
          @click="loadPalettes"
          class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
        >
          搜索
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" text="加载中..." />

    <!-- Empty State -->
    <div
      v-if="!loading && palettes.length === 0"
      class="text-center py-16 rounded-xl border"
      :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }"
    >
      <p class="text-lg font-medium mb-2" :style="{ color: 'var(--color-text)' }">暂无色彩方案</p>
      <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">
        前往「色彩提取」页面提取并保存你的第一个色彩方案
      </p>
    </div>

    <!-- Palette Grid -->
    <div v-if="!loading && palettes.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="palette in palettes"
        :key="palette.id"
        class="rounded-xl border p-4 space-y-3 hover:shadow-md transition-shadow"
        :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold" :style="{ color: 'var(--color-text)' }">{{ palette.name }}</h3>
            <p v-if="palette.description" class="text-sm mt-0.5" :style="{ color: 'var(--color-text-secondary)' }">
              {{ palette.description }}
            </p>
          </div>
          <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            {{ palette.color_count }} 色
          </span>
        </div>

        <div v-if="palette.tags && palette.tags.length" class="flex flex-wrap gap-1">
          <span
            v-for="tag in palette.tags"
            :key="tag"
            class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800"
            :style="{ color: 'var(--color-text-secondary)' }"
          >
            {{ tag }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-xs" :style="{ color: 'var(--color-text-secondary)' }">
            {{ new Date(palette.created_at).toLocaleDateString('zh-CN') }}
          </span>
          <div class="flex gap-1">
            <button @click="handleView(palette.id)" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" :style="{ color: 'var(--color-text-secondary)' }">
              <Eye class="w-4 h-4" />
            </button>
            <button @click="handleExport(palette.id)" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" :style="{ color: 'var(--color-text-secondary)' }">
              <Download class="w-4 h-4" />
            </button>
            <button @click="handleDelete(palette.id)" class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div
        v-if="showDetail && selectedPalette"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="showDetail = false"
      >
        <div class="w-full max-w-lg rounded-xl p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto" :style="{ backgroundColor: 'var(--color-bg)' }">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold" :style="{ color: 'var(--color-text)' }">{{ selectedPalette.name }}</h3>
            <button @click="showDetail = false" class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" :style="{ color: 'var(--color-text-secondary)' }">
              <X class="w-5 h-5" />
            </button>
          </div>

          <p v-if="selectedPalette.description" class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">
            {{ selectedPalette.description }}
          </p>

          <div class="flex h-12 rounded-lg overflow-hidden">
            <div
              v-for="color in selectedPalette.colors"
              :key="color.id"
              :style="{ backgroundColor: color.hex_value, width: (color.percentage || (100 / selectedPalette.colors.length)) + '%' }"
            />
          </div>

          <div class="space-y-2">
            <div
              v-for="color in selectedPalette.colors"
              :key="color.id"
              class="flex items-center gap-3 p-2 rounded-lg"
            >
              <ColorSwatch :hex="color.hex_value" :percentage="color.percentage" show-info />
              <span class="text-xs font-mono" :style="{ color: 'var(--color-text-secondary)' }">
                RGB({{ color.rgb_r }}, {{ color.rgb_g }}, {{ color.rgb_b }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
