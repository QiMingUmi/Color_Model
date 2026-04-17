<script setup lang="ts">
import { ref, computed } from 'vue'
import { Wand2, Palette, Download, RotateCcw, SlidersHorizontal, Loader2, ArrowLeftRight, ImagePlus, Check } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import UploadZone from '../components/UploadZone.vue'
import { DEMO_PALETTES } from '../utils/color'

const mode = ref<'auto' | 'guided'>('auto')
const selectedStyle = ref('anime')
const selectedPalette = ref<string | null>(null)
const isProcessing = ref(false)
const showResult = ref(false)
const compareMode = ref(false)
const saturation = ref(100)
const brightness = ref(100)

const styles = [
  { id: 'anime', name: '动漫风格', desc: '适合漫画、插画线稿' },
  { id: 'realistic', name: '写实风格', desc: '适合素描、写实画稿' },
  { id: 'watercolor', name: '水彩风格', desc: '模拟水彩画效果' },
  { id: 'flat', name: '扁平风格', desc: '简洁明快的色块填充' },
]

const savedPalettes = [
  { id: '1', name: '海洋落日', colors: DEMO_PALETTES[0] },
  { id: '2', name: '森林大地', colors: DEMO_PALETTES[1] },
  { id: '3', name: '热带激情', colors: DEMO_PALETTES[2] },
]

const currentPaletteColors = computed(() => {
  if (!selectedPalette.value) return null
  return savedPalettes.find(p => p.id === selectedPalette.value)?.colors
})

const gradientBg = computed(() => {
  if (mode.value === 'guided' && currentPaletteColors.value) {
    return `linear-gradient(135deg, ${currentPaletteColors.value.map(c => c.hex).join(', ')})`
  }
  return 'linear-gradient(135deg, #e8d5b7, #b8c9a3, #f0e0c8, #d4b896, #c5a882)'
})

function handleColorize() {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    showResult.value = true
  }, 2000)
}

function switchMode(m: 'auto' | 'guided') {
  mode.value = m
  showResult.value = false
}
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <AppHeader title="线稿上色" subtitle="智能模型自动上色 / 导入色彩方案引导上色" />

    <div class="p-6 max-w-6xl mx-auto">
      <!-- Mode Switcher -->
      <div class="flex items-center gap-2 bg-white rounded-2xl border border-surface-200 p-1.5 w-fit mb-6">
        <button @click="switchMode('auto')" :class="mode === 'auto' ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-surface-600 hover:bg-surface-50'" class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Wand2 :size="16" /> 自动上色
        </button>
        <button @click="switchMode('guided')" :class="mode === 'guided' ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/20' : 'text-surface-600 hover:bg-surface-50'" class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Palette :size="16" /> 引导上色
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- Left Panel -->
        <div class="lg:col-span-2 space-y-5">
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4">上传线稿</h3>
            <UploadZone label="拖拽或点击上传线稿" description="支持黑白线稿和灰度线稿" />
          </div>

          <!-- Style Selection (Auto) -->
          <div v-if="mode === 'auto'" class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4">上色风格</h3>
            <div class="grid grid-cols-2 gap-3">
              <button v-for="s in styles" :key="s.id" @click="selectedStyle = s.id" :class="selectedStyle === s.id ? 'border-primary-400 bg-primary-50' : 'border-surface-200 hover:border-surface-300'" class="p-3 rounded-xl border-2 text-left transition-all">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-surface-700">{{ s.name }}</span>
                  <Check v-if="selectedStyle === s.id" :size="14" class="text-primary-500" />
                </div>
                <p class="text-[10px] text-surface-400 mt-0.5">{{ s.desc }}</p>
              </button>
            </div>
          </div>

          <!-- Palette Selection (Guided) -->
          <div v-if="mode === 'guided'" class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4">选择色彩方案</h3>
            <div class="space-y-3">
              <button v-for="p in savedPalettes" :key="p.id" @click="selectedPalette = p.id" :class="selectedPalette === p.id ? 'border-accent-400 shadow-md' : 'border-surface-200 hover:border-surface-300'" class="w-full rounded-xl border-2 overflow-hidden text-left transition-all">
                <div class="h-8 flex">
                  <div v-for="(c, i) in p.colors" :key="i" :style="{ backgroundColor: c.hex, flex: c.percentage }" />
                </div>
                <div class="p-3 flex items-center justify-between">
                  <span class="text-xs font-medium text-surface-700">{{ p.name }}</span>
                  <Check v-if="selectedPalette === p.id" :size="14" class="text-accent-500" />
                </div>
              </button>
            </div>
            <div class="mt-4 pt-4 border-t border-surface-100">
              <button class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-surface-300 text-xs text-surface-500 hover:border-accent-400 hover:text-accent-500 transition-colors">
                <ImagePlus :size="14" /> 上传参考图片实时提取
              </button>
            </div>
          </div>

          <!-- Post-processing -->
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2">
              <SlidersHorizontal :size="16" /> 后处理参数
            </h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2"><label class="text-xs font-medium text-surface-600">饱和度</label><span class="text-xs text-surface-400">{{ saturation }}%</span></div>
                <input type="range" :min="0" :max="200" v-model.number="saturation" class="w-full accent-primary-500" />
              </div>
              <div>
                <div class="flex justify-between mb-2"><label class="text-xs font-medium text-surface-600">亮度</label><span class="text-xs text-surface-400">{{ brightness }}%</span></div>
                <input type="range" :min="0" :max="200" v-model.number="brightness" class="w-full accent-primary-500" />
              </div>
            </div>
          </div>

          <button @click="handleColorize" :disabled="isProcessing" :class="mode === 'auto' ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700' : 'bg-gradient-to-r from-accent-500 to-accent-600 shadow-accent-500/20 hover:from-accent-600 hover:to-accent-700'" class="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
            <span v-if="isProcessing" class="flex items-center justify-center gap-2"><Loader2 :size="16" class="animate-spin" /> 上色处理中...</span>
            <span v-else>{{ mode === 'auto' ? '开始自动上色' : '开始引导上色' }}</span>
          </button>
        </div>

        <!-- Right: Result Area -->
        <div class="lg:col-span-3 space-y-5">
          <div v-if="!showResult" class="bg-white rounded-2xl border border-surface-200 p-16 text-center">
            <div class="w-24 h-24 mx-auto rounded-3xl bg-surface-100 flex items-center justify-center mb-5">
              <Wand2 v-if="mode === 'auto'" :size="40" class="text-surface-300" />
              <Palette v-else :size="40" class="text-surface-300" />
            </div>
            <p class="text-sm font-medium text-surface-500">{{ mode === 'auto' ? '上传线稿后点击"开始自动上色"' : '上传线稿并选择色彩方案后开始上色' }}</p>
            <p class="text-xs text-surface-400 mt-1.5 max-w-xs mx-auto">{{ mode === 'auto' ? '模型将根据学习到的色彩规律自动为线稿分配合适的颜色' : '使用您选择的色彩方案作为引导，模型将按照指定色彩风格上色' }}</p>
          </div>

          <template v-else>
            <!-- Toolbar -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span :class="mode === 'auto' ? 'bg-primary-50 text-primary-600' : 'bg-accent-50 text-accent-600'" class="px-3 py-1 rounded-full text-xs font-medium">{{ mode === 'auto' ? '自动上色' : '引导上色' }}</span>
                <span v-if="mode === 'guided' && selectedPalette" class="text-xs text-surface-400">使用方案：{{ savedPalettes.find(p => p.id === selectedPalette)?.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="compareMode = !compareMode" :class="compareMode ? 'bg-primary-50 text-primary-600 border border-primary-200' : 'text-surface-600 bg-white border border-surface-200 hover:bg-surface-50'" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"><ArrowLeftRight :size="14" /> 对比视图</button>
                <button @click="handleColorize" class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-surface-600 bg-white border border-surface-200 hover:bg-surface-50 transition-colors"><RotateCcw :size="14" /> 重新生成</button>
                <button class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm"><Download :size="14" /> 下载结果</button>
              </div>
            </div>

            <!-- Result Display -->
            <div class="bg-white rounded-2xl border border-surface-200 overflow-hidden">
              <div v-if="compareMode" class="grid grid-cols-2 divide-x divide-surface-200">
                <div class="p-4">
                  <p class="text-xs font-medium text-surface-500 mb-3 text-center">原始线稿</p>
                  <div class="aspect-square bg-surface-100 rounded-xl flex items-center justify-center">
                    <div class="text-center"><div class="w-32 h-32 mx-auto bg-surface-200 rounded-xl mb-2" /><span class="text-[10px] text-surface-400">线稿预览</span></div>
                  </div>
                </div>
                <div class="p-4">
                  <p class="text-xs font-medium text-surface-500 mb-3 text-center">上色结果</p>
                  <div class="aspect-square rounded-xl overflow-hidden flex items-center justify-center" :style="{ background: gradientBg }">
                    <div class="text-center"><div class="w-32 h-32 mx-auto bg-white/20 backdrop-blur rounded-xl mb-2" /><span class="text-[10px] text-white/70">上色结果预览</span></div>
                  </div>
                </div>
              </div>
              <div v-else class="p-6">
                <div class="aspect-video rounded-xl overflow-hidden flex items-center justify-center" :style="{ background: gradientBg }">
                  <div class="text-center p-8">
                    <div class="w-48 h-48 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl mb-4 flex items-center justify-center"><Wand2 :size="48" class="text-white/50" /></div>
                    <p class="text-white/80 text-sm font-medium">上色结果预览区域</p>
                    <p class="text-white/50 text-xs mt-1">实际使用时将展示上色后的图片</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Used Palette (Guided) -->
            <div v-if="mode === 'guided' && currentPaletteColors" class="bg-white rounded-2xl border border-surface-200 p-5">
              <h3 class="text-sm font-semibold text-surface-800 mb-3">使用的色彩方案</h3>
              <div class="h-10 flex rounded-xl overflow-hidden">
                <div v-for="(c, i) in currentPaletteColors" :key="i" class="h-full relative group" :style="{ backgroundColor: c.hex, flex: c.percentage }">
                  <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-mono bg-black/20">{{ c.hex }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
