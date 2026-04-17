<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Pipette, PaintBucket, Sparkles, FolderOpen, ArrowRight, Palette, Zap, Eye } from 'lucide-vue-next'
import AppHeader from '../components/AppHeader.vue'
import { DEMO_PALETTES } from '../utils/color'

const router = useRouter()

const features = [
  { icon: Pipette, title: '色彩提取', desc: '从任意图片中智能提取主要构成色彩，生成专业调色板', path: '/extract', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
  { icon: PaintBucket, title: '线稿上色', desc: '基于深度学习模型自动上色，或导入色彩方案引导上色', path: '/colorize', gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
  { icon: Sparkles, title: '色彩推荐', desc: '基于色彩理论和应用场景，为您推荐专业配色方案', path: '/recommend', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
  { icon: FolderOpen, title: '方案管理', desc: '管理您保存的所有色彩方案，支持搜索、编辑与导出', path: '/palettes', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
]

const stats = [
  { icon: Palette, value: '12', label: '已保存方案', color: 'text-primary-500' },
  { icon: Zap, value: '8', label: '上色任务', color: 'text-accent-500' },
  { icon: Eye, value: '156', label: '色彩分析', color: 'text-emerald-500' },
]
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <AppHeader title="首页概览" subtitle="智能色彩方案生成与推荐系统" />

    <div class="p-6 max-w-6xl mx-auto space-y-8">
      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 p-8 md:p-12 text-white">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div class="absolute bottom-0 left-0 w-72 h-72 bg-accent-400 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div class="relative z-10 max-w-2xl">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Palette :size="20" />
            </div>
            <span class="text-sm font-medium text-white/70">ColorMind AI</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold leading-tight">
            智能色彩方案<br />
            <span class="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">生成与推荐系统</span>
          </h2>
          <p class="mt-4 text-white/60 leading-relaxed max-w-lg">
            利用计算机视觉与深度学习技术，从参考图片中提取色彩、为线稿智能上色、获取专业配色推荐——让色彩创作更高效、更专业。
          </p>
          <button
            @click="router.push('/extract')"
            class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-surface-900 font-semibold text-sm hover:bg-white/90 transition-all hover:gap-3"
          >
            开始使用 <ArrowRight :size="16" />
          </button>
        </div>

        <div class="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 gap-3">
          <div
            v-for="(c, i) in DEMO_PALETTES[0]"
            :key="i"
            class="rounded-2xl shadow-2xl"
            :style="{ backgroundColor: c.hex, width: '48px', height: `${80 + i * 20}px`, opacity: 0.9, transform: `rotate(${(i - 2) * 5}deg)` }"
          />
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-2xl border border-surface-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 rounded-xl bg-surface-50 flex items-center justify-center" :class="stat.color">
            <component :is="stat.icon" :size="22" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-800">{{ stat.value }}</p>
            <p class="text-xs text-surface-500">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Feature Cards -->
      <div>
        <h3 class="text-lg font-semibold text-surface-800 mb-4">核心功能</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            v-for="f in features"
            :key="f.path"
            @click="router.push(f.path)"
            :class="f.bg"
            class="rounded-2xl p-6 text-left group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-surface-200"
          >
            <div
              class="w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform"
              :class="f.gradient"
            >
              <component :is="f.icon" :size="20" />
            </div>
            <h4 class="font-semibold text-surface-800 text-sm">{{ f.title }}</h4>
            <p class="text-xs text-surface-500 mt-1.5 leading-relaxed">{{ f.desc }}</p>
            <div class="mt-4 flex items-center gap-1 text-xs font-medium text-primary-500 group-hover:gap-2 transition-all">
              进入模块 <ArrowRight :size="14" />
            </div>
          </button>
        </div>
      </div>

      <!-- Demo Palettes -->
      <div>
        <h3 class="text-lg font-semibold text-surface-800 mb-4">示例调色板</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(palette, pi) in DEMO_PALETTES"
            :key="pi"
            class="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div class="h-20 flex">
              <div v-for="(c, ci) in palette" :key="ci" class="h-full" :style="{ backgroundColor: c.hex, flex: c.percentage }" />
            </div>
            <div class="p-4">
              <div class="flex gap-2">
                <div v-for="(c, ci) in palette" :key="ci" class="flex flex-col items-center gap-1">
                  <div class="w-8 h-8 rounded-lg shadow-sm" :style="{ backgroundColor: c.hex }" />
                  <span class="text-[10px] font-mono text-surface-500">{{ c.hex }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
