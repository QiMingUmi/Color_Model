<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    accept?: string
    label?: string
  }>(),
  {
    accept: 'image/*',
    label: '拖拽图片到此处或点击上传',
  }
)

const emit = defineEmits<{
  select: [file: File]
}>()

const isDragging = ref(false)
const previewUrl = ref<string | null>(null)

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) selectFile(file)
}

function handleInput(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) selectFile(file)
}

function selectFile(file: File) {
  previewUrl.value = URL.createObjectURL(file)
  emit('select', file)
}
</script>

<template>
  <div
    class="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
    :class="
      isDragging
        ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
    "
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="handleDrop"
    @click="($refs.fileInput as HTMLInputElement).click()"
  >
    <input ref="fileInput" type="file" :accept="accept" class="hidden" @change="handleInput" />

    <div v-if="previewUrl" class="space-y-3">
      <img :src="previewUrl" class="max-h-48 mx-auto rounded-lg shadow-md" alt="Preview" />
      <p class="text-sm" :style="{ color: 'var(--color-text-secondary)' }">点击更换图片</p>
    </div>

    <div v-else class="space-y-3">
      <div class="w-14 h-14 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
        <Upload class="w-7 h-7 text-indigo-500" />
      </div>
      <p class="text-sm font-medium" :style="{ color: 'var(--color-text)' }">{{ label }}</p>
      <p class="text-xs" :style="{ color: 'var(--color-text-secondary)' }">
        支持 JPEG、PNG、BMP、WebP 格式，最大 20MB
      </p>
    </div>
  </div>
</template>
