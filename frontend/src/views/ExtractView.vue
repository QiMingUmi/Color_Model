<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { uploadImage } from '@/api/images'
import { extractColors } from '@/api/colors'
import { createPalette } from '@/api/palettes'
import type { Color, PaletteCreate } from '@/types'
import FileUpload from '@/components/common/FileUpload.vue'
import ColorSwatch from '@/components/common/ColorSwatch.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { Save, Wand2, RotateCcw } from 'lucide-vue-next'

const appStore = useAppStore()

const imagePath = ref('')
const numColors = ref(5)
const extractedColors = ref<Color[]>([])
const loading = ref(false)
const showSaveDialog = ref(false)
const saveName = ref('')
const saveDescription = ref('')
const saveTags = ref('')

async function handleFileSelect(file: File) {
  try {
    loading.value = true
    const result = await uploadImage(file)
    imagePath.value = result.image_path
    appStore.showNotification('success', '图片上传成功')
  } catch {
    appStore.showNotification('error', '图片上传失败')
  } finally {
    loading.value = false
  }
}

async function handleExtract() {
  if (!imagePath.value) {
    appStore.showNotification('error', '请先上传图片')
    return
  }
  try {
    loading.value = true
    const result = await extractColors({ image_path: imagePath.value, num_colors: numColors.value })
    extractedColors.value = result.colors
    appStore.showNotification('success', `成功提取 ${result.colors.length} 种颜色`)
  } catch {
    appStore.showNotification('error', '色彩提取失败')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!saveName.value.trim()) {
    appStore.showNotification('error', '请输入方案名称')
    return
  }
  try {
    const data: PaletteCreate = {
      name: saveName.value.trim(),
      description: saveDescription.value.trim() || undefined,
      tags: saveTags.value ? saveTags.value.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
      colors: extractedColors.value.map((c) => ({
        hex_value: c.hex_value,
        rgb_r: c.rgb_r,
        rgb_g: c.rgb_g,
        rgb_b: c.rgb_b,
        hsl_h: c.hsl_h,
        hsl_s: c.hsl_s,
        hsl_l: c.hsl_l,
        percentage: c.percentage,
        sort_order: c.sort_order,
      })),
    }
    await createPalette(data)
    appStore.showNotification('success', '色彩方案保存成功')
    showSaveDialog.value = false
    saveName.value = ''
    saveDescription.value = ''
    saveTags.value = ''
  } catch {
    appStore.showNotification('error', '保存失败')
  }
}

function reset() {
  imagePath.value = ''
  extractedColors.value = []
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Upload Section -->
    <div class="rounded-xl border p-6" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
      <h2 class="text-base font-semibold mb-4" :style="{ color: 'var(--color-text)' }">上传图片</h2>
      <FileUpload @select="handleFileSelect" label="拖拽图片到此处或点击上传" />
    </div>

    <!-- Extract Controls -->
    <div class="rounded-xl border p-6" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium" :style="{ color: 'var(--color-text)' }">提取颜色数量</label>
          <input
            v-model.number="numColors"
            type="range"
            min="3"
            max="15"
            class="w-32 accent-indigo-500"
          />
          <span class="text-sm font-mono w-6 text-center" :style="{ color: 'var(--color-text)' }">{{ numColors }}</span>
        </div>
        <div class="flex gap-2">
          <button
            @click="reset"
            class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            :style="{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }"
          >
            <RotateCcw class="w-4 h-4" /> 重置
          </button>
          <button
            @click="handleExtract"
            :disabled="!imagePath || loading"
            class="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Wand2 class="w-4 h-4" /> 提取色彩
          </button>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading" text="正在处理中..." />

    <!-- Results -->
    <div
      v-if="extractedColors.length > 0 && !loading"
      class="rounded-xl border p-6 space-y-5"
      :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold" :style="{ color: 'var(--color-text)' }">提取结果</h2>
        <button
          @click="showSaveDialog = true"
          class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
        >
          <Save class="w-4 h-4" /> 保存方案
        </button>
      </div>

      <!-- Color Bar -->
      <div class="flex h-16 rounded-xl overflow-hidden shadow-sm">
        <div
          v-for="color in extractedColors"
          :key="color.hex_value"
          :style="{ backgroundColor: color.hex_value, width: color.percentage + '%' }"
          class="transition-all duration-300"
        />
      </div>

      <!-- Color Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="color in extractedColors"
          :key="color.hex_value"
          class="flex items-center gap-3 p-3 rounded-lg border"
          :style="{ borderColor: 'var(--color-border)' }"
        >
          <ColorSwatch :hex="color.hex_value" :percentage="color.percentage" show-info size="lg" />
          <div class="text-xs space-y-0.5" :style="{ color: 'var(--color-text-secondary)' }">
            <div>RGB({{ color.rgb_r }}, {{ color.rgb_g }}, {{ color.rgb_b }})</div>
            <div>HSL({{ color.hsl_h }}°, {{ color.hsl_s }}%, {{ color.hsl_l }}%)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Dialog -->
    <Teleport to="body">
      <div
        v-if="showSaveDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="showSaveDialog = false"
      >
        <div class="w-full max-w-md rounded-xl p-6 shadow-2xl space-y-4" :style="{ backgroundColor: 'var(--color-bg)' }">
          <h3 class="text-lg font-semibold" :style="{ color: 'var(--color-text)' }">保存色彩方案</h3>

          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">方案名称 *</label>
              <input
                v-model="saveName"
                class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
                placeholder="输入方案名称"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">描述</label>
              <textarea
                v-model="saveDescription"
                rows="2"
                class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
                placeholder="描述这个配色方案"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" :style="{ color: 'var(--color-text)' }">标签 (逗号分隔)</label>
              <input
                v-model="saveTags"
                class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
                placeholder="如: 温暖, 日落, 自然"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button
              @click="showSaveDialog = false"
              class="px-4 py-2 rounded-lg text-sm border transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              :style="{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }"
            >
              取消
            </button>
            <button
              @click="handleSave"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
