<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { theoryRecommend, sceneRecommend, analyzeColors } from '@/api/recommend'
import type {
  TheoryRecommendResponse,
  SceneRecommendResponse,
  AnalyzeResponse,
  ColorRule,
} from '@/types'
import ColorSwatch from '@/components/common/ColorSwatch.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { Sparkles, Layers, BarChart3 } from 'lucide-vue-next'

const appStore = useAppStore()

const activeTab = ref<'theory' | 'scene' | 'analyze'>('theory')

const baseColor = ref('#6366F1')
const selectedRule = ref<ColorRule>('complementary')
const theoryResult = ref<TheoryRecommendResponse | null>(null)
const loading = ref(false)

const sceneCategory = ref<string>('')
const sceneResult = ref<SceneRecommendResponse | null>(null)

const analyzeInput = ref('#6366F1, #F59E0B, #10B981, #EF4444, #8B5CF6')
const analyzeResult = ref<AnalyzeResponse | null>(null)

const rules: { value: ColorRule; label: string }[] = [
  { value: 'complementary', label: '互补色' },
  { value: 'analogous', label: '类似色' },
  { value: 'triadic', label: '三色搭配' },
  { value: 'split_complementary', label: '分裂互补' },
  { value: 'tetradic', label: '四色搭配' },
  { value: 'square', label: '正方搭配' },
]

const categories = [
  { value: '', label: '全部' },
  { value: 'emotion', label: '情感' },
  { value: 'industry', label: '行业' },
  { value: 'season', label: '季节' },
  { value: 'style', label: '风格' },
]

async function handleTheoryRecommend() {
  try {
    loading.value = true
    theoryResult.value = await theoryRecommend({
      base_color: baseColor.value,
      rule: selectedRule.value,
    })
  } catch {
    appStore.showNotification('error', '推荐生成失败')
  } finally {
    loading.value = false
  }
}

async function handleSceneRecommend() {
  try {
    loading.value = true
    sceneResult.value = await sceneRecommend(sceneCategory.value || undefined)
  } catch {
    appStore.showNotification('error', '加载场景推荐失败')
  } finally {
    loading.value = false
  }
}

async function handleAnalyze() {
  const hexValues = analyzeInput.value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^#[0-9a-fA-F]{6}$/.test(s))

  if (hexValues.length < 2) {
    appStore.showNotification('error', '请输入至少 2 个有效的 HEX 颜色值')
    return
  }

  try {
    loading.value = true
    analyzeResult.value = await analyzeColors(hexValues.map((h) => ({ hex_value: h })))
  } catch {
    appStore.showNotification('error', '分析失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  handleSceneRecommend()
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Tabs -->
    <div class="flex rounded-xl border overflow-hidden" :style="{ borderColor: 'var(--color-border)' }">
      <button
        v-for="tab in [
          { key: 'theory', label: '色彩理论', icon: Sparkles },
          { key: 'scene', label: '场景推荐', icon: Layers },
          { key: 'analyze', label: '色彩分析', icon: BarChart3 },
        ]"
        :key="tab.key"
        @click="activeTab = tab.key as any"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
        :class="activeTab === tab.key ? 'bg-indigo-500 text-white' : ''"
        :style="activeTab !== tab.key ? { color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' } : {}"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Theory Tab -->
    <template v-if="activeTab === 'theory'">
      <div class="rounded-xl border p-6 space-y-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
        <h2 class="text-base font-semibold" :style="{ color: 'var(--color-text)' }">基于色彩理论推荐</h2>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--color-text)' }">基准色</label>
            <div class="flex items-center gap-2">
              <input type="color" v-model="baseColor" class="w-10 h-10 rounded cursor-pointer border-0" />
              <input
                v-model="baseColor"
                class="flex-1 px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--color-text)' }">配色规则</label>
            <select
              v-model="selectedRule"
              class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
            >
              <option v-for="r in rules" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="handleTheoryRecommend"
              :disabled="loading"
              class="w-full px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 transition-colors"
            >
              生成推荐
            </button>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <div
        v-if="theoryResult && !loading"
        class="rounded-xl border p-6 space-y-4"
        :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }"
      >
        <h3 class="font-semibold" :style="{ color: 'var(--color-text)' }">{{ theoryResult.rule_description }}</h3>
        <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">{{ theoryResult.usage_hint }}</p>

        <div class="flex h-16 rounded-xl overflow-hidden shadow-sm">
          <div
            v-for="(color, i) in theoryResult.colors"
            :key="i"
            :style="{ backgroundColor: color.hex_value, flex: '1' }"
          />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="(color, i) in theoryResult.colors"
            :key="i"
            class="flex items-center gap-3 p-3 rounded-lg border"
            :style="{ borderColor: 'var(--color-border)' }"
          >
            <ColorSwatch :hex="color.hex_value" show-info />
            <span v-if="color.name" class="text-xs" :style="{ color: 'var(--color-text-secondary)' }">
              {{ color.name }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Scene Tab -->
    <template v-if="activeTab === 'scene'">
      <div class="rounded-xl border p-6" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="sceneCategory = cat.value; handleSceneRecommend()"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            :class="sceneCategory === cat.value ? 'bg-indigo-500 text-white' : 'border'"
            :style="sceneCategory !== cat.value ? { color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' } : {}"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <div v-if="sceneResult && !loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="preset in sceneResult.presets"
          :key="preset.id"
          class="rounded-xl border p-5 space-y-3 hover:shadow-md transition-shadow"
          :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }"
        >
          <h3 class="font-semibold" :style="{ color: 'var(--color-text)' }">{{ preset.name }}</h3>
          <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">{{ preset.description }}</p>

          <div class="flex h-10 rounded-lg overflow-hidden">
            <div v-for="(c, i) in preset.colors" :key="i" :style="{ backgroundColor: c.hex_value, flex: '1' }" />
          </div>

          <div class="flex flex-wrap gap-2">
            <div v-for="(c, i) in preset.colors" :key="i" class="flex items-center gap-1.5">
              <div class="w-4 h-4 rounded" :style="{ backgroundColor: c.hex_value }" />
              <span class="text-xs font-mono" :style="{ color: 'var(--color-text-secondary)' }">{{ c.hex_value }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in preset.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800"
              :style="{ color: 'var(--color-text-secondary)' }"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Analyze Tab -->
    <template v-if="activeTab === 'analyze'">
      <div class="rounded-xl border p-6 space-y-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
        <h2 class="text-base font-semibold" :style="{ color: 'var(--color-text)' }">色彩方案分析</h2>

        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--color-text)' }">
            输入颜色值 (HEX，逗号分隔)
          </label>
          <input
            v-model="analyzeInput"
            class="w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
            placeholder="#FF5733, #33FF57, #3357FF"
          />
        </div>

        <div class="flex h-10 rounded-lg overflow-hidden">
          <div
            v-for="hex in analyzeInput.split(',').map(s => s.trim()).filter(s => /^#[0-9a-fA-F]{6}$/.test(s))"
            :key="hex"
            :style="{ backgroundColor: hex, flex: '1' }"
          />
        </div>

        <button
          @click="handleAnalyze"
          :disabled="loading"
          class="px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 transition-colors"
        >
          分析配色
        </button>
      </div>

      <LoadingSpinner v-if="loading" />

      <div
        v-if="analyzeResult && !loading"
        class="space-y-4"
      >
        <!-- Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="rounded-xl border p-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
            <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">色调</p>
            <p class="text-lg font-semibold mt-1" :style="{ color: 'var(--color-text)' }">
              {{ analyzeResult.tone === 'warm' ? '🔥 暖色调' : analyzeResult.tone === 'cool' ? '❄️ 冷色调' : '⚖️ 中性' }}
            </p>
          </div>
          <div class="rounded-xl border p-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
            <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">和谐度</p>
            <p class="text-lg font-semibold mt-1" :style="{ color: 'var(--color-text)' }">{{ analyzeResult.harmony_score }} / 10</p>
          </div>
          <div class="rounded-xl border p-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
            <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">平均饱和度</p>
            <p class="text-lg font-semibold mt-1" :style="{ color: 'var(--color-text)' }">{{ analyzeResult.saturation_avg }}%</p>
          </div>
          <div class="rounded-xl border p-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
            <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">平均亮度</p>
            <p class="text-lg font-semibold mt-1" :style="{ color: 'var(--color-text)' }">{{ analyzeResult.lightness_avg }}%</p>
          </div>
        </div>

        <!-- Harmony Description -->
        <div class="rounded-xl border p-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
          <p class="text-sm font-medium" :style="{ color: 'var(--color-text)' }">{{ analyzeResult.harmony_description }}</p>
          <p class="text-sm mt-1" :style="{ color: 'var(--color-text-secondary)' }">{{ analyzeResult.tone_description }}</p>
        </div>

        <!-- Contrast Pairs -->
        <div class="rounded-xl border p-4 space-y-3" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
          <h3 class="font-semibold" :style="{ color: 'var(--color-text)' }">对比度分析</h3>
          <div class="space-y-2">
            <div
              v-for="(pair, i) in analyzeResult.contrast_pairs"
              :key="i"
              class="flex items-center gap-3 p-2 rounded-lg"
              :style="{ backgroundColor: 'var(--color-bg-secondary)' }"
            >
              <div class="w-6 h-6 rounded" :style="{ backgroundColor: pair.color1 }" />
              <span class="text-xs font-mono" :style="{ color: 'var(--color-text-secondary)' }">↔</span>
              <div class="w-6 h-6 rounded" :style="{ backgroundColor: pair.color2 }" />
              <span class="text-sm font-mono ml-2" :style="{ color: 'var(--color-text)' }">{{ pair.ratio }}:1</span>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="pair.wcag_aa ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'"
              >
                AA {{ pair.wcag_aa ? '✓' : '✗' }}
              </span>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="pair.wcag_aaa ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'"
              >
                AAA {{ pair.wcag_aaa ? '✓' : '✗' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <div class="rounded-xl border p-4 space-y-2" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
          <h3 class="font-semibold" :style="{ color: 'var(--color-text)' }">优化建议</h3>
          <ul class="space-y-1">
            <li
              v-for="(suggestion, i) in analyzeResult.suggestions"
              :key="i"
              class="text-sm flex items-start gap-2"
              :style="{ color: 'var(--color-text-secondary)' }"
            >
              <span class="text-indigo-500 mt-0.5">•</span>
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
