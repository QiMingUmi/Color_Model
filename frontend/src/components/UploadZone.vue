<script setup lang="ts">
import { ref } from 'vue'
import { Upload, Image as ImageIcon, X } from 'lucide-vue-next'

withDefaults(defineProps<{
  label: string
  description: string
  accept?: string
}>(), {
  accept: 'image/*',
})

const emit = defineEmits<{ fileSelect: [file: File] }>()

const dragActive = ref(false)
const preview = ref<string | null>(null)
const fileName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function handleFile(file: File) {
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => (preview.value = e.target?.result as string)
  reader.readAsDataURL(file)
  emit('fileSelect', file)
}

function onDrag(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = e.type === 'dragenter' || e.type === 'dragover'
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  dragActive.value = false
  const file = e.dataTransfer?.files[0]
  if (file) handleFile(file)
}

function onChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

function clearFile() {
  preview.value = null
  fileName.value = ''
  if (inputRef.value) inputRef.value.value = ''
}
</script>

<template>
  <!-- Preview state -->
  <div v-if="preview" class="relative rounded-2xl border-2 border-surface-200 overflow-hidden bg-surface-50">
    <img :src="preview" alt="预览" class="w-full max-h-80 object-contain bg-[#f5f5f5]" />
    <div class="absolute top-3 right-3 flex gap-2">
      <button @click="clearFile" class="p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors">
        <X :size="16" />
      </button>
    </div>
    <div class="px-4 py-3 bg-white border-t border-surface-200">
      <div class="flex items-center gap-2">
        <ImageIcon :size="14" class="text-surface-400" />
        <span class="text-xs text-surface-600 truncate">{{ fileName }}</span>
        <button @click="inputRef?.click()" class="ml-auto text-xs text-primary-500 hover:text-primary-600 font-medium">
          更换图片
        </button>
      </div>
    </div>
    <input ref="inputRef" type="file" :accept="accept" @change="onChange" class="hidden" />
  </div>

  <!-- Upload state -->
  <div
    v-else
    @dragenter="onDrag"
    @dragleave="onDrag"
    @dragover="onDrag"
    @drop="onDrop"
    @click="inputRef?.click()"
    class="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 group"
    :class="dragActive
      ? 'border-primary-400 bg-primary-50/50 scale-[1.01]'
      : 'border-surface-300 bg-surface-50 hover:border-primary-300 hover:bg-primary-50/30'"
  >
    <div
      class="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors"
      :class="dragActive
        ? 'bg-primary-100 text-primary-500'
        : 'bg-surface-200 text-surface-400 group-hover:bg-primary-100 group-hover:text-primary-500'"
    >
      <Upload :size="24" />
    </div>
    <p class="text-sm font-medium text-surface-700">{{ label }}</p>
    <p class="text-xs text-surface-400 mt-1">{{ description }}</p>
    <p class="text-[10px] text-surface-400 mt-3">支持 JPEG、PNG、BMP、WebP 格式，最大 20MB</p>
    <input ref="inputRef" type="file" :accept="accept" @change="onChange" class="hidden" />
  </div>
</template>
