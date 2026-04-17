<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Filter, Plus, Grid3X3, List, Download, Upload, SortAsc, Tag } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import PaletteCard from '../components/PaletteCard.vue'
import { DEMO_PALETTES, createColorInfo } from '../utils/color'
import type { Palette } from '../types'

const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedTag = ref<string | null>(null)

const demoData: Palette[] = [
  { id: '1', name: '海洋落日', description: '温暖与冷色调的完美平衡', tags: ['自然', '温暖', '风景'], colors: DEMO_PALETTES[0], createdAt: '2026-04-15', updatedAt: '2026-04-15' },
  { id: '2', name: '森林大地', description: '自然沉稳的大地色系', tags: ['自然', '复古', '大地色'], colors: DEMO_PALETTES[1], createdAt: '2026-04-14', updatedAt: '2026-04-14' },
  { id: '3', name: '热带激情', description: '充满活力的热烈配色', tags: ['活力', '热烈', '夏天'], colors: DEMO_PALETTES[2], createdAt: '2026-04-13', updatedAt: '2026-04-13' },
  { id: '4', name: '极简北欧', description: '清新简约的北欧风格', tags: ['简约', '北欧', '冷色'], colors: [createColorInfo('#ECEBE4', 30), createColorInfo('#D3CEC4', 25), createColorInfo('#9F978E', 20), createColorInfo('#6B6560', 15), createColorInfo('#3D3835', 10)], createdAt: '2026-04-12', updatedAt: '2026-04-12' },
  { id: '5', name: '赛博霓虹', description: '未来科技感的霓虹配色', tags: ['科技', '赛博朋克', '霓虹'], colors: [createColorInfo('#0D0221', 25), createColorInfo('#0F084B', 20), createColorInfo('#26408B', 20), createColorInfo('#A6CFD5', 20), createColorInfo('#C2E7D9', 15)], createdAt: '2026-04-11', updatedAt: '2026-04-11' },
  { id: '6', name: '樱花物语', description: '柔美淡雅的日式配色', tags: ['日系', '柔和', '春天'], colors: [createColorInfo('#F7CAC9', 25), createColorInfo('#92A8D1', 20), createColorInfo('#955251', 20), createColorInfo('#B565A7', 20), createColorInfo('#009B77', 15)], createdAt: '2026-04-10', updatedAt: '2026-04-10' },
]

const allTags = computed(() => [...new Set(demoData.flatMap(p => p.tags))])

const filtered = computed(() =>
  demoData.filter(p => {
    const matchSearch = !searchQuery.value || p.name.includes(searchQuery.value) || p.description.includes(searchQuery.value) || p.tags.some(t => t.includes(searchQuery.value))
    const matchTag = !selectedTag.value || p.tags.includes(selectedTag.value)
    return matchSearch && matchTag
  })
)
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <AppHeader title="方案管理" subtitle="管理您保存的所有色彩方案" />

    <div class="p-6 max-w-6xl mx-auto">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div class="relative flex-1 max-w-xs">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input v-model="searchQuery" type="text" placeholder="搜索方案名称、标签..." class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400 transition-all" />
          </div>
          <div class="flex items-center gap-1 bg-white rounded-xl border border-surface-200 p-1">
            <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-surface-400 hover:bg-surface-50'" class="p-2 rounded-lg transition-colors"><Grid3X3 :size="16" /></button>
            <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-surface-400 hover:bg-surface-50'" class="p-2 rounded-lg transition-colors"><List :size="16" /></button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors"><SortAsc :size="14" /> 排序</button>
          <button class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors"><Upload :size="14" /> 导入</button>
          <button class="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors"><Download :size="14" /> 批量导出</button>
          <button class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm"><Plus :size="14" /> 新建方案</button>
        </div>
      </div>

      <!-- Tags Filter -->
      <div class="flex items-center gap-2 mb-5 flex-wrap">
        <Filter :size="14" class="text-surface-400" />
        <button @click="selectedTag = null" :class="!selectedTag ? 'bg-primary-500 text-white' : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'" class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors">全部</button>
        <button v-for="tag in allTags" :key="tag" @click="selectedTag = selectedTag === tag ? null : tag" :class="selectedTag === tag ? 'bg-primary-500 text-white' : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'" class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1">
          <Tag :size="10" /> {{ tag }}
        </button>
      </div>

      <div class="flex items-center justify-between mb-4">
        <p class="text-xs text-surface-500">共 <span class="font-semibold text-surface-700">{{ filtered.length }}</span> 个色彩方案</p>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <PaletteCard v-for="p in filtered" :key="p.id" :palette="p" />
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="space-y-3">
        <div v-for="p in filtered" :key="p.id" class="bg-white rounded-xl border border-surface-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer">
          <div class="w-32 h-12 rounded-lg overflow-hidden flex shrink-0">
            <div v-for="(c, i) in p.colors" :key="i" class="h-full" :style="{ backgroundColor: c.hex, flex: c.percentage || 1 }" />
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-surface-800">{{ p.name }}</h4>
            <p class="text-xs text-surface-500 truncate">{{ p.description }}</p>
          </div>
          <div class="flex gap-1.5 shrink-0">
            <span v-for="tag in p.tags" :key="tag" class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-600">{{ tag }}</span>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <div v-for="(c, i) in p.colors.slice(0, 5)" :key="i" class="w-5 h-5 rounded-full border border-white shadow-sm" :style="{ backgroundColor: c.hex }" />
          </div>
          <span class="text-[10px] text-surface-400 shrink-0">{{ p.createdAt }}</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filtered.length === 0" class="text-center py-16">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-surface-100 flex items-center justify-center mb-4"><Search :size="28" class="text-surface-300" /></div>
        <p class="text-sm text-surface-500">没有找到匹配的色彩方案</p>
        <p class="text-xs text-surface-400 mt-1">尝试修改搜索条件或清除筛选</p>
      </div>
    </div>
  </div>
</template>
