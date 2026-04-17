<script setup lang="ts">
withDefaults(defineProps<{
  baseColor?: string
  highlightAngles?: number[]
  size?: number
}>(), {
  baseColor: '#3366ff',
  highlightAngles: () => [],
  size: 240,
})

function polarToCart(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="drop-shadow-lg">
    <!-- Color ring segments -->
    <path
      v-for="i in 360"
      :key="i"
      :d="(() => {
        const center = size / 2
        const radius = size / 2 - 20
        const innerRadius = radius * 0.55
        const a1 = ((i - 1) - 90) * Math.PI / 180
        const a2 = (i - 90) * Math.PI / 180
        const x1o = center + radius * Math.cos(a1)
        const y1o = center + radius * Math.sin(a1)
        const x2o = center + radius * Math.cos(a2)
        const y2o = center + radius * Math.sin(a2)
        const x1i = center + innerRadius * Math.cos(a1)
        const y1i = center + innerRadius * Math.sin(a1)
        const x2i = center + innerRadius * Math.cos(a2)
        const y2i = center + innerRadius * Math.sin(a2)
        return `M ${x1i} ${y1i} L ${x1o} ${y1o} A ${radius} ${radius} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerRadius} ${innerRadius} 0 0 0 ${x1i} ${y1i}`
      })()"
      :fill="`hsl(${i - 1}, 80%, 55%)`"
    />

    <!-- Inner white circle -->
    <circle :cx="size / 2" :cy="size / 2" :r="(size / 2 - 20) * 0.55 - 2" fill="white" />

    <!-- Base color dot -->
    <circle :cx="size / 2" :cy="size / 2" :r="(size / 2 - 20) * 0.55 * 0.6" :fill="baseColor" class="drop-shadow-md" />

    <!-- Highlight dots -->
    <g v-for="(angle, idx) in highlightAngles" :key="idx">
      <circle
        :cx="polarToCart(size / 2, size / 2, ((size / 2 - 20) + (size / 2 - 20) * 0.55) / 2, angle).x"
        :cy="polarToCart(size / 2, size / 2, ((size / 2 - 20) + (size / 2 - 20) * 0.55) / 2, angle).y"
        :r="10"
        fill="white"
        stroke="white"
        :stroke-width="3"
        class="drop-shadow"
      />
      <circle
        :cx="polarToCart(size / 2, size / 2, ((size / 2 - 20) + (size / 2 - 20) * 0.55) / 2, angle).x"
        :cy="polarToCart(size / 2, size / 2, ((size / 2 - 20) + (size / 2 - 20) * 0.55) / 2, angle).y"
        :r="7"
        :fill="`hsl(${angle}, 80%, 55%)`"
      />
    </g>
  </svg>
</template>
