<template>
  <div class="count-up-wrapper">
    <span class="count-up-prefix" v-if="prefix">{{ prefix }}</span>
    <span class="count-up-value" :class="{ 'text-glow': glow }">{{ displayValue }}</span>
    <span class="count-up-suffix" v-if="suffix">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

interface Props {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: boolean
  glow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1500,
  decimals: 0,
  separator: true,
  glow: false
})

const displayValue = ref('0')
let animationFrame: number | null = null

function formatNumber(num: number): string {
  const fixed = num.toFixed(props.decimals)
  if (props.separator) {
    const parts = fixed.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }
  return fixed
}

function animateValue(start: number, end: number, duration: number): void {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    const current = start + (end - start) * easeProgress
    displayValue.value = formatNumber(current)
    if (progress < 1) animationFrame = requestAnimationFrame(update)
  }

  animationFrame = requestAnimationFrame(update)
}

function parseDisplayValue(): number {
  return parseFloat(displayValue.value.replace(/,/g, '')) || 0
}

watch(() => props.value, (newVal, oldVal) => {
  const start = oldVal !== undefined ? oldVal : parseDisplayValue()
  animateValue(start, newVal, props.duration)
})

onMounted(() => {
  animateValue(0, props.value, props.duration)
})
</script>

<style lang="scss" scoped>
.count-up-wrapper {
  display: inline-flex;
  align-items: baseline;
  font-variant-numeric: tabular-nums;
}

.count-up-prefix { font-size: 0.6em; color: $text-secondary; margin-right: 4px; }

.count-up-value {
  font-weight: 700;
  font-family: 'DIN Alternate', 'Microsoft YaHei', monospace;
  letter-spacing: 1px;
}

.count-up-suffix { font-size: 0.5em; color: $text-secondary; margin-left: 6px; font-weight: 400; }
</style>
