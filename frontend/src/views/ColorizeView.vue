<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { uploadLineart, autoColorize, guidedColorize } from '@/api/colorize'
import { listPalettes } from '@/api/palettes'
import type { ColorizeTask, PaletteListItem } from '@/types'
import FileUpload from '@/components/common/FileUpload.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { Wand2, Palette } from 'lucide-vue-next'

const appStore = useAppStore()

const lineartPath = ref('')
const mode = ref<'auto' | 'guided'>('auto')
const style = ref('anime')
const selectedPaletteId = ref<number | null>(null)
const palettes = ref<PaletteListItem[]>([])
const loading = ref(false)
const result = ref<ColorizeTask | null>(null)

async function loadPalettes() {
  try {
    palettes.value = await listPalettes({ limit: 50 })
  } catch {
    // ignore
  }
}

async function handleFileSelect(file: File) {
  try {
    loading.value = true
    const res = await uploadLineart(file)
    lineartPath.value = res.lineart_path
    appStore.showNotification('success', '线稿上传成功')
  } catch {
    appStore.showNotification('error', '线稿上传失败')
  } finally {
    loading.value = false
  }
}

async function handleColorize() {
  if (!lineartPath.value) {
    appStore.showNotification('error', '请先上传线稿')
    return
  }

  try {
    loading.value = true
    if (mode.value === 'auto') {
      result.value = await autoColorize({ lineart_path: lineartPath.value, style: style.value })
    } else {
      if (!selectedPaletteId.value) {
        appStore.showNotification('error', '请选择色彩方案')
        return
      }
      result.value = await guidedColorize({
        lineart_path: lineartPath.value,
        palette_id: selectedPaletteId.value,
        style: style.value,
      })
    }

    if (result.value?.status === 'completed') {
      appStore.showNotification('success', '上色完成')
    } else {
      appStore.showNotification('error', '上色失败')
    }
  } catch {
    appStore.showNotification('error', '上色处理失败')
  } finally {
    loading.value = false
  }
}

function getImageUrl(path: string): string {
  const uploadsIndex = path.indexOf('uploads/')
  if (uploadsIndex >= 0) {
    return '/' + path.substring(uploadsIndex)
  }
  return path
}

onMounted(loadPalettes)
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Upload -->
    <div class="rounded-xl border p-6" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
      <h2 class="text-base font-semibold mb-4" :style="{ color: 'var(--color-text)' }">上传线稿</h2>
      <FileUpload @select="handleFileSelect" label="拖拽线稿到此处或点击上传" />
    </div>

    <!-- Controls -->
    <div class="rounded-xl border p-6 space-y-4" :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Mode -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--color-text)' }">上色模式</label>
          <div class="flex rounded-lg border overflow-hidden" :style="{ borderColor: 'var(--color-border)' }">
            <button
              @click="mode = 'auto'"
              class="flex-1 px-3 py-2 text-sm font-medium transition-colors"
              :class="mode === 'auto' ? 'bg-indigo-500 text-white' : ''"
              :style="mode !== 'auto' ? { color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-secondary)' } : {}"
            >
              <Wand2 class="w-4 h-4 inline mr-1" />自动
            </button>
            <button
              @click="mode = 'guided'"
              class="flex-1 px-3 py-2 text-sm font-medium transition-colors"
              :class="mode === 'guided' ? 'bg-indigo-500 text-white' : ''"
              :style="mode !== 'guided' ? { color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-secondary)' } : {}"
            >
              <Palette class="w-4 h-4 inline mr-1" />引导
            </button>
          </div>
        </div>

        <!-- Style -->
        <div>
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--color-text)' }">上色风格</label>
          <select
            v-model="style"
            class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
          >
            <option value="anime">动漫风格</option>
            <option value="realistic">写实风格</option>
          </select>
        </div>

        <!-- Palette Selection (guided mode) -->
        <div v-if="mode === 'guided'">
          <label class="block text-sm font-medium mb-1.5" :style="{ color: 'var(--color-text)' }">选择色彩方案</label>
          <select
            v-model="selectedPaletteId"
            class="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :style="{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text)' }"
          >
            <option :value="null" disabled>请选择方案</option>
            <option v-for="p in palettes" :key="p.id" :value="p.id">
              {{ p.name }} ({{ p.color_count }}色)
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          @click="handleColorize"
          :disabled="!lineartPath || loading"
          class="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Wand2 class="w-4 h-4" /> 开始上色
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading" text="正在上色中，请稍候..." />

    <!-- Result -->
    <div
      v-if="result && result.status === 'completed' && result.result_path && !loading"
      class="rounded-xl border p-6 space-y-4"
      :style="{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }"
    >
      <h2 class="text-base font-semibold" :style="{ color: 'var(--color-text)' }">上色结果</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm mb-2" :style="{ color: 'var(--color-text-secondary)' }">原始线稿</p>
          <img
            :src="getImageUrl(result.lineart_path)"
            class="w-full rounded-lg border"
            :style="{ borderColor: 'var(--color-border)' }"
            alt="Line Art"
          />
        </div>
        <div>
          <p class="text-sm mb-2" :style="{ color: 'var(--color-text-secondary)' }">上色结果</p>
          <img
            :src="getImageUrl(result.result_path!)"
            class="w-full rounded-lg border"
            :style="{ borderColor: 'var(--color-border)' }"
            alt="Colorized"
          />
        </div>
      </div>

      <div class="flex justify-end">
        <a
          :href="getImageUrl(result.result_path!)"
          download
          class="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
        >
          下载结果
        </a>
      </div>
    </div>
  </div>
</template>
