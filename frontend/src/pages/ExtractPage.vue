<script setup lang="ts">
import { ref } from 'vue'
import { Download, Save, RotateCcw, SlidersHorizontal, BarChart3, Grid3X3, ChevronDown, Tag } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import UploadZone from '../components/UploadZone.vue'
import ColorSwatch from '../components/ColorSwatch.vue'
import { DEMO_PALETTES, createColorInfo } from '../utils/color'
import type { ColorInfo } from '../types'

const extractedColors = ref<ColorInfo[] | null>(null)
const colorCount = ref(5)
const viewMode = ref<'palette' | 'grid'>('palette')
const showSaveModal = ref(false)
const saveName = ref('')
const saveDesc = ref('')
const saveTags = ref('')

function handleExtract() {
  const demoIndex = Math.floor(Math.random() * DEMO_PALETTES.length)
  const base = DEMO_PALETTES[demoIndex]
  const extra = [
    createColorInfo('#8ecae6', 8), createColorInfo('#219ebc', 7),
    createColorInfo('#023047', 12), createColorInfo('#ffb703', 10),
    createColorInfo('#fb8500', 9), createColorInfo('#606c38', 6),
    createColorInfo('#dda15e', 5), createColorInfo('#bc6c25', 4),
    createColorInfo('#a2d2ff', 3), createColorInfo('#bde0fe', 2),
  ]
  const pool = [...base, ...extra]
  const selected = pool.slice(0, colorCount.value)
  const total = selected.reduce((s, c) => s + c.percentage, 0)
  extractedColors.value = selected.map(c => ({ ...c, percentage: Math.round((c.percentage / total) * 100) }))
}

function closeSaveModal() {
  showSaveModal.value = false
  saveName.value = ''
  saveDesc.value = ''
  saveTags.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <AppHeader title="色彩提取" subtitle="从图片中智能提取主要构成色彩" />

    <div class="p-6 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Left: Upload & Controls -->
        <div class="lg:col-span-2 space-y-5">
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4">上传图片</h3>
            <UploadZone label="拖拽或点击上传图片" description="上传一张图片以提取其主要色彩" />
          </div>

          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
              <SlidersHorizontal :size="16" /> 提取参数
            </h3>
            <div class="space-y-4">
              <div>
                <label class="text-xs font-medium text-surface-600 mb-2 block">提取颜色数量：{{ colorCount }}</label>
                <input type="range" :min="3" :max="15" v-model.number="colorCount" class="w-full accent-primary-500" />
                <div class="flex justify-between text-[10px] text-surface-400 mt-1"><span>3</span><span>9</span><span>15</span></div>
              </div>
              <div>
                <label class="text-xs font-medium text-surface-600 mb-2 block">聚类算法</label>
                <div class="relative">
                  <select class="w-full appearance-none px-3 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/40 pr-8">
                    <option>K-Means 聚类</option><option>DBSCAN</option><option>Mean Shift</option><option>中位切分法</option>
                  </select>
                  <ChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label class="text-xs font-medium text-surface-600 mb-2 block">色彩空间</label>
                <div class="relative">
                  <select class="w-full appearance-none px-3 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400/40 pr-8">
                    <option>CIELAB（推荐）</option><option>RGB</option><option>HSV</option>
                  </select>
                  <ChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <button @click="handleExtract" class="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98] cursor-pointer">
              开始提取色彩
            </button>
          </div>
        </div>

        <!-- Right: Results -->
        <div class="lg:col-span-3 space-y-5">
          <div v-if="!extractedColors" class="bg-white rounded-2xl border border-surface-200 p-12 text-center">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
              <BarChart3 :size="32" class="text-surface-300" />
            </div>
            <p class="text-sm font-medium text-surface-500">上传图片并提取色彩</p>
            <p class="text-xs text-surface-400 mt-1">提取结果将在此处展示</p>
          </div>

          <template v-else>
            <!-- Toolbar -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 bg-white rounded-xl border border-surface-200 p-1">
                <button @click="viewMode = 'palette'" :class="viewMode === 'palette' ? 'bg-primary-50 text-primary-600' : 'text-surface-500 hover:bg-surface-50'" class="p-2 rounded-lg text-xs font-medium transition-colors"><BarChart3 :size="16" /></button>
                <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-surface-500 hover:bg-surface-50'" class="p-2 rounded-lg text-xs font-medium transition-colors"><Grid3X3 :size="16" /></button>
              </div>
              <div class="flex items-center gap-2">
                <button @click="handleExtract" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors"><RotateCcw :size="14" /> 重新提取</button>
                <button @click="showSaveModal = true" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm"><Save :size="14" /> 保存方案</button>
                <button class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors"><Download :size="14" /> 导出</button>
              </div>
            </div>

            <!-- Palette View -->
            <div v-if="viewMode === 'palette'" class="bg-white rounded-2xl border border-surface-200 overflow-hidden">
              <div class="h-28 flex">
                <div v-for="(c, i) in extractedColors" :key="i" class="h-full relative group" :style="{ backgroundColor: c.hex, flex: c.percentage }">
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="px-2 py-1 rounded-lg bg-black/30 text-white text-xs font-mono backdrop-blur-sm">{{ c.hex }}</span>
                  </div>
                </div>
              </div>
              <div class="p-5 space-y-3">
                <div v-for="(c, i) in extractedColors" :key="i" class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl shadow-sm shrink-0" :style="{ backgroundColor: c.hex }" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-mono font-semibold text-surface-800 uppercase w-16">{{ c.hex }}</span>
                      <span class="text-[10px] text-surface-500">RGB({{ c.rgb.r }}, {{ c.rgb.g }}, {{ c.rgb.b }})</span>
                      <span class="text-[10px] text-surface-500">HSL({{ c.hsl.h }}°, {{ c.hsl.s }}%, {{ c.hsl.l }}%)</span>
                    </div>
                    <div class="mt-1.5 h-2 rounded-full bg-surface-100 overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500" :style="{ width: c.percentage + '%', backgroundColor: c.hex }" />
                    </div>
                  </div>
                  <span class="text-xs font-semibold text-surface-600 w-10 text-right">{{ c.percentage }}%</span>
                </div>
              </div>
            </div>

            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="bg-white rounded-2xl border border-surface-200 p-5">
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-4">
                <ColorSwatch v-for="(c, i) in extractedColors" :key="i" :color="c" size="lg" show-percentage />
              </div>
            </div>

            <!-- Distribution Chart -->
            <div class="bg-white rounded-2xl border border-surface-200 p-5">
              <h3 class="text-sm font-semibold text-surface-800 mb-4">色彩分布概览</h3>
              <div class="flex items-end gap-2 h-32">
                <div v-for="(c, i) in extractedColors" :key="i" class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-[10px] font-medium text-surface-500">{{ c.percentage }}%</span>
                  <div
                    class="w-full rounded-t-lg transition-all duration-500"
                    :style="{ backgroundColor: c.hex, height: `${(c.percentage / Math.max(...extractedColors!.map(x => x.percentage))) * 100}%`, minHeight: '8px' }"
                  />
                  <span class="text-[9px] font-mono text-surface-400 truncate w-full text-center">{{ c.hex }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Save Modal -->
    <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click="closeSaveModal">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-surface-800 mb-5">保存色彩方案</h3>
        <div class="space-y-4">
          <div>
            <label class="text-xs font-medium text-surface-600 mb-1.5 block">方案名称 *</label>
            <input v-model="saveName" placeholder="例如：海洋落日配色" class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400" />
          </div>
          <div>
            <label class="text-xs font-medium text-surface-600 mb-1.5 block">描述</label>
            <textarea v-model="saveDesc" placeholder="简要描述这个配色方案的特点..." rows="3" class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400 resize-none" />
          </div>
          <div>
            <label class="text-xs font-medium text-surface-600 mb-1.5 flex items-center gap-1"><Tag :size="12" /> 标签</label>
            <input v-model="saveTags" placeholder="用逗号分隔，例如：自然,温暖,风景" class="w-full px-4 py-2.5 rounded-xl bg-surface-50 border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400" />
          </div>
          <div v-if="extractedColors">
            <label class="text-xs font-medium text-surface-600 mb-2 block">预览</label>
            <div class="h-12 flex rounded-xl overflow-hidden">
              <div v-for="(c, i) in extractedColors" :key="i" :style="{ backgroundColor: c.hex, flex: c.percentage }" />
            </div>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="closeSaveModal" class="flex-1 py-2.5 rounded-xl text-sm font-medium text-surface-600 bg-surface-100 hover:bg-surface-200 transition-colors">取消</button>
          <button @click="closeSaveModal" class="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
