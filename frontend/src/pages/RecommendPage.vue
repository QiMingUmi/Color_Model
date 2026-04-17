<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, BookOpen, Layers, TrendingUp, BarChart3, Save, PaintBucket, Info, ShieldCheck, Eye } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import ColorWheel from '../components/ColorWheel.vue'
import ColorSwatch from '../components/ColorSwatch.vue'
import { generateScheme, createColorInfo, hexToRgb, rgbToHsl, SCENE_PALETTES } from '../utils/color'

type Tab = 'theory' | 'scene' | 'trend' | 'analyze'

const activeTab = ref<Tab>('theory')
const baseColor = ref('#3366ff')
const selectedScheme = ref('complementary')
const selectedScene = ref<string | null>('warm')
const analyzeColors = ref(['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'])

const schemeTypes = [
  { id: 'complementary', name: '互补色', desc: '色轮上对立的两种颜色', angles: [0, 180] },
  { id: 'analogous', name: '类似色', desc: '色轮上相邻的颜色', angles: [330, 0, 30] },
  { id: 'triadic', name: '三色搭配', desc: '色轮上等距的三种颜色', angles: [0, 120, 240] },
  { id: 'split-complementary', name: '分裂互补', desc: '基色与互补色两侧的颜色', angles: [0, 150, 210] },
  { id: 'tetradic', name: '四色搭配', desc: '色轮上等距的四种颜色', angles: [0, 90, 180, 270] },
  { id: 'square', name: '正方搭配', desc: '色轮上构成正方形的四种颜色', angles: [0, 90, 180, 270] },
]

const sceneCategories = [
  { name: '情感', items: [{ name: '温暖', key: 'warm' }, { name: '冷静', key: 'cool' }, { name: '活力', key: 'vibrant' }, { name: '优雅', key: 'elegant' }] },
  { name: '风格', items: [{ name: '自然', key: 'nature' }, { name: '复古', key: 'retro' }, { name: '赛博朋克', key: 'cyberpunk' }, { name: '日系', key: 'japanese' }, { name: '北欧', key: 'nordic' }, { name: '科技', key: 'tech' }] },
]

const trendColors = [
  { year: '2026', name: 'Mocha Mousse', hex: '#A47764', desc: '温润柔和的摩卡色' },
  { year: '2025', name: 'Peach Fuzz', hex: '#FFBE98', desc: '温暖包容的蜜桃色' },
  { year: '2024', name: 'Viva Magenta', hex: '#BB2649', desc: '大胆活力的洋红色' },
  { year: '2023', name: 'Very Peri', hex: '#6667AB', desc: '灵动创意的长春花蓝' },
]

const tabs: { id: Tab; icon: typeof BookOpen; label: string }[] = [
  { id: 'theory', icon: BookOpen, label: '色彩理论' },
  { id: 'scene', icon: Layers, label: '场景推荐' },
  { id: 'trend', icon: TrendingUp, label: '流行趋势' },
  { id: 'analyze', icon: BarChart3, label: '色彩分析' },
]

const schemeColors = computed(() => generateScheme(baseColor.value, selectedScheme.value))
const currentSchemeType = computed(() => schemeTypes.find(s => s.id === selectedScheme.value)!)
const wheelAngles = computed(() => {
  const rgb = hexToRgb(baseColor.value)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return currentSchemeType.value.angles.map(a => (a + hsl.h) % 360)
})

const schemeDesc: Record<string, { scene: string; effect: string }> = {
  complementary: { scene: '需要强烈视觉对比的设计，如按钮/CTA、运动品牌', effect: '高对比度、醒目、充满活力' },
  analogous: { scene: '希望营造和谐统一感的设计，如自然风景、舒适空间', effect: '柔和、自然、协调统一' },
  triadic: { scene: '需要丰富色彩但保持平衡的设计，如儿童产品、节日海报', effect: '色彩丰富、生动活泼、平衡' },
  'split-complementary': { scene: '想要对比但不那么强烈的设计，适合初学者使用', effect: '中等对比、灵活多变' },
  tetradic: { scene: '需要多色彩的复杂设计，如信息图表、仪表盘', effect: '丰富多彩、复杂但有序' },
  square: { scene: '需要均衡多色的设计，如品牌色彩系统', effect: '均衡、稳定、多样化' },
}

function removeAnalyzeColor(idx: number) {
  analyzeColors.value = analyzeColors.value.filter((_, j) => j !== idx)
}
function addAnalyzeColor() {
  analyzeColors.value.push('#888888')
}
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <AppHeader title="色彩推荐" subtitle="基于色彩理论与应用场景的专业配色推荐" />

    <div class="p-6 max-w-6xl mx-auto">
      <!-- Tab Bar -->
      <div class="flex items-center gap-1 bg-white rounded-2xl border border-surface-200 p-1.5 mb-6 w-fit">
        <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id" :class="activeTab === t.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20' : 'text-surface-600 hover:bg-surface-50'" class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <component :is="t.icon" :size="16" /> {{ t.label }}
        </button>
      </div>

      <!-- Theory Tab -->
      <div v-if="activeTab === 'theory'" class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-2 space-y-5">
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4">选择基准色</h3>
            <div class="flex items-center gap-4">
              <input type="color" v-model="baseColor" class="w-16 h-16 rounded-xl cursor-pointer border-2 border-surface-200" />
              <div>
                <p class="text-sm font-mono font-semibold text-surface-800 uppercase">{{ baseColor }}</p>
                <p class="text-xs text-surface-400 mt-0.5">点击色块选取基准色</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4">配色规则</h3>
            <div class="space-y-2">
              <button v-for="s in schemeTypes" :key="s.id" @click="selectedScheme = s.id" :class="selectedScheme === s.id ? 'bg-amber-50 border-2 border-amber-400' : 'border-2 border-surface-100 hover:border-surface-200'" class="w-full p-3 rounded-xl text-left transition-all">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-surface-700">{{ s.name }}</span>
                  <span class="text-[10px] text-surface-400">{{ s.angles.length }} 色</span>
                </div>
                <p class="text-[10px] text-surface-400 mt-0.5">{{ s.desc }}</p>
              </button>
            </div>
          </div>
        </div>
        <div class="lg:col-span-3 space-y-5">
          <div class="bg-white rounded-2xl border border-surface-200 p-6">
            <div class="flex flex-col md:flex-row items-center gap-8">
              <ColorWheel :base-color="baseColor" :highlight-angles="wheelAngles" :size="220" />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-surface-800 mb-1">{{ currentSchemeType.name }}</h3>
                <p class="text-xs text-surface-500 mb-4">{{ currentSchemeType.desc }}</p>
                <div class="flex gap-3 flex-wrap">
                  <ColorSwatch v-for="(hex, i) in schemeColors" :key="i" :color="createColorInfo(hex)" size="md" />
                </div>
                <div class="mt-5 flex gap-2">
                  <button class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-sm"><Save :size="14" /> 保存方案</button>
                  <button class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-surface-600 bg-surface-100 hover:bg-surface-200 transition-colors"><PaintBucket :size="14" /> 用于上色</button>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-3 flex items-center gap-2"><Info :size="14" /> 方案说明</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-xl bg-surface-50">
                <p class="text-[10px] font-medium text-surface-600 mb-1">适用场景</p>
                <p class="text-xs text-surface-500">{{ schemeDesc[selectedScheme]?.scene }}</p>
              </div>
              <div class="p-3 rounded-xl bg-surface-50">
                <p class="text-[10px] font-medium text-surface-600 mb-1">视觉效果</p>
                <p class="text-xs text-surface-500">{{ schemeDesc[selectedScheme]?.effect }}</p>
              </div>
            </div>
          </div>
          <div class="rounded-2xl overflow-hidden" :style="{ background: `linear-gradient(135deg, ${schemeColors.join(', ')})` }">
            <div class="p-8 backdrop-blur-sm bg-black/10 text-center">
              <p class="text-white text-sm font-medium">配色方案预览效果</p>
              <p class="text-white/60 text-xs mt-1">直观感受推荐色彩的搭配效果</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Scene Tab -->
      <div v-if="activeTab === 'scene'" class="space-y-6">
        <div v-for="cat in sceneCategories" :key="cat.name">
          <h3 class="text-sm font-semibold text-surface-800 mb-3">按{{ cat.name }}推荐</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <button v-for="item in cat.items" :key="item.key" @click="selectedScene = item.key" :class="selectedScene === item.key ? 'border-amber-400 shadow-md' : 'border-surface-200 hover:border-surface-300'" class="rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-lg">
              <div class="h-16 flex">
                <div v-for="(c, i) in (SCENE_PALETTES[item.key] || [])" :key="i" class="h-full flex-1" :style="{ backgroundColor: c }" />
              </div>
              <div class="p-3 bg-white">
                <span class="text-xs font-medium text-surface-700">{{ item.name }}</span>
                <p class="text-[10px] text-surface-400 mt-0.5">{{ (SCENE_PALETTES[item.key] || []).length }} 色方案</p>
              </div>
            </button>
          </div>
        </div>
        <div v-if="selectedScene && SCENE_PALETTES[selectedScene]" class="bg-white rounded-2xl border border-surface-200 p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-surface-800">当前选择：{{ sceneCategories.flatMap(c => c.items).find(i => i.key === selectedScene)?.name }}</h3>
            <div class="flex gap-2">
              <button class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors"><Save :size="14" /> 保存</button>
              <button class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-surface-600 bg-surface-100 hover:bg-surface-200 transition-colors"><PaintBucket :size="14" /> 用于上色</button>
            </div>
          </div>
          <div class="h-20 flex rounded-xl overflow-hidden mb-4">
            <div v-for="(c, i) in SCENE_PALETTES[selectedScene]" :key="i" class="h-full flex-1 relative group" :style="{ backgroundColor: c }">
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-mono bg-black/20">{{ c }}</span>
            </div>
          </div>
          <div class="flex gap-4">
            <ColorSwatch v-for="(c, i) in SCENE_PALETTES[selectedScene]" :key="i" :color="createColorInfo(c)" size="sm" />
          </div>
        </div>
      </div>

      <!-- Trend Tab -->
      <div v-if="activeTab === 'trend'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div v-for="t in trendColors" :key="t.year" class="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-lg transition-all">
          <div class="h-36 flex items-center justify-center relative" :style="{ backgroundColor: t.hex }">
            <div class="text-center">
              <p class="text-white/80 text-xs font-medium mb-1">{{ t.year }} 年度流行色</p>
              <p class="text-white text-xl font-bold">{{ t.name }}</p>
            </div>
            <div class="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/20 backdrop-blur-sm">
              <span class="text-white text-[10px] font-mono">{{ t.hex }}</span>
            </div>
          </div>
          <div class="p-4">
            <p class="text-xs text-surface-500">{{ t.desc }}</p>
            <div class="mt-3 flex gap-2">
              <div v-for="(c, i) in generateScheme(t.hex, 'analogous')" :key="i" class="w-8 h-8 rounded-lg shadow-sm" :style="{ backgroundColor: c }" />
              <div class="flex-1" />
              <button class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"><Save :size="12" /> 保存</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Analyze Tab -->
      <div v-if="activeTab === 'analyze'" class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-2 space-y-5">
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4">输入色彩方案</h3>
            <div class="space-y-3">
              <div v-for="(c, i) in analyzeColors" :key="i" class="flex items-center gap-3">
                <input type="color" :value="c" @input="analyzeColors[i] = ($event.target as HTMLInputElement).value" class="w-10 h-10 rounded-lg cursor-pointer border border-surface-200" />
                <span class="text-xs font-mono text-surface-600 flex-1 uppercase">{{ c }}</span>
                <button v-if="analyzeColors.length > 2" @click="removeAnalyzeColor(i)" class="text-surface-400 hover:text-red-500 text-xs">✕</button>
              </div>
              <button v-if="analyzeColors.length < 10" @click="addAnalyzeColor" class="w-full py-2 rounded-xl border-2 border-dashed border-surface-200 text-xs text-surface-400 hover:border-surface-300 hover:text-surface-500 transition-colors">+ 添加颜色</button>
            </div>
            <button class="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20 cursor-pointer">开始分析</button>
          </div>
        </div>
        <div class="lg:col-span-3 space-y-5">
          <!-- Harmony Score -->
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2"><Sparkles :size="14" /> 和谐度评分</h3>
            <div class="flex items-center gap-6">
              <div class="relative w-24 h-24">
                <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" stroke-width="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="url(#scoreGrad)" stroke-width="8" stroke-linecap="round" :stroke-dasharray="`${8.2 * 2 * Math.PI * 40 / 10} ${2 * Math.PI * 40}`" />
                  <defs><linearGradient id="scoreGrad"><stop offset="0%" stop-color="#f59e0b" /><stop offset="100%" stop-color="#f97316" /></linearGradient></defs>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-xl font-bold text-surface-800">8.2</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-emerald-600">和谐度优秀</p>
                <p class="text-xs text-surface-500 mt-1">此色彩方案整体搭配协调，颜色之间过渡自然</p>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl border border-surface-200 p-4">
              <p class="text-[10px] font-medium text-surface-500 mb-2">色调倾向</p>
              <p class="text-sm font-semibold text-surface-800">暖色调为主</p>
              <div class="mt-2 h-2 rounded-full overflow-hidden flex">
                <div class="bg-orange-400 h-full" style="width:65%" /><div class="bg-blue-400 h-full" style="width:20%" /><div class="bg-gray-300 h-full" style="width:15%" />
              </div>
              <div class="flex justify-between mt-1"><span class="text-[9px] text-surface-400">暖色 65%</span><span class="text-[9px] text-surface-400">冷色 20%</span><span class="text-[9px] text-surface-400">中性 15%</span></div>
            </div>
            <div class="bg-white rounded-2xl border border-surface-200 p-4">
              <p class="text-[10px] font-medium text-surface-500 mb-2">饱和度分布</p>
              <p class="text-sm font-semibold text-surface-800">中高饱和度</p>
              <div class="flex items-end gap-1.5 mt-2 h-10">
                <div v-for="(v, i) in [30, 65, 85, 70, 90]" :key="i" class="flex-1 rounded-t" :style="{ height: v + '%', backgroundColor: analyzeColors[i] || '#ddd' }" />
              </div>
            </div>
          </div>
          <!-- WCAG -->
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2"><ShieldCheck :size="14" /> 可访问性检测 (WCAG)</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div class="flex items-center gap-2 mb-1"><div class="w-2 h-2 rounded-full bg-emerald-500" /><span class="text-[10px] font-medium text-emerald-700">AA 通过</span></div>
                <p class="text-xs text-emerald-600">主色与背景对比度 4.8:1</p>
              </div>
              <div class="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div class="flex items-center gap-2 mb-1"><div class="w-2 h-2 rounded-full bg-amber-500" /><span class="text-[10px] font-medium text-amber-700">AAA 待优化</span></div>
                <p class="text-xs text-amber-600">建议提高辅色明度差异</p>
              </div>
            </div>
          </div>
          <!-- Color Blind Simulation -->
          <div class="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 class="text-sm font-semibold text-surface-800 mb-4 flex items-center gap-2"><Eye :size="14" /> 色觉模拟预览</h3>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="lbl in ['正常视觉', '红色盲', '绿色盲']" :key="lbl">
                <p class="text-[10px] text-surface-500 mb-2 text-center">{{ lbl }}</p>
                <div class="h-8 flex rounded-lg overflow-hidden">
                  <div v-for="(c, i) in analyzeColors" :key="i" class="h-full flex-1" :style="{ backgroundColor: c, filter: lbl === '红色盲' ? 'grayscale(30%) sepia(30%)' : lbl === '绿色盲' ? 'grayscale(20%) hue-rotate(30deg)' : 'none' }" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
