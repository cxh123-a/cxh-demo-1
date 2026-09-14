<template>
  <div class="gradient-progress">
    <div class="progress-header" v-if="showLabel">
      <span class="progress-label">{{ label }}</span>
      <span class="progress-value">{{ displayPercent }}%</span>
    </div>
    <div class="progress-track">
      <div class="progress-bar" :class="{ 'progress-animate': animate }" :style="barStyle">
        <div class="progress-glow"></div>
        <div class="progress-shimmer"></div>
      </div>
      <div class="progress-dot" :style="dotStyle" v-if="showDot"></div>
    </div>
    <div class="progress-footer" v-if="showDetail">
      <span class="progress-current">{{ formatValue(current) }}</span>
      <span class="progress-target">目标: {{ formatValue(target) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
  current: number
  target: number
  label?: string
  color?: string
  gradient?: string
  showLabel?: boolean
  showDetail?: boolean
  showDot?: boolean
  animate?: boolean
  decimals?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: '完成进度',
  color: '',
  gradient: '',
  showLabel: true,
  showDetail: false,
  showDot: true,
  animate: true,
  decimals: 1
})

const displayPercent = ref(0)
let animationFrame: number | null = null

const percent = computed(() => {
  if (props.target <= 0) return 0
  return Math.min((props.current / props.target) * 100, 100)
})

const barStyle = computed(() => {
  const bg = props.gradient || props.color || 'linear-gradient(90deg, #4f8cff, #a855f7)'
  return { width: `${displayPercent.value}%`, background: bg }
})

const dotStyle = computed(() => ({ left: `${displayPercent.value}%` }))

function formatValue(value: number): string {
  if (value >= 100000000) return (value / 100000000).toFixed(2) + '亿'
  if (value >= 10000) return (value / 10000).toFixed(0) + '万'
  return value.toLocaleString()
}

function animatePercent(start: number, end: number, duration: number) {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  const startTime = performance.now()

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    displayPercent.value = start + (end - start) * easeProgress
    if (progress < 1) animationFrame = requestAnimationFrame(update)
  }

  animationFrame = requestAnimationFrame(update)
}

watch(() => props.current, (newVal) => {
  const targetPercent = Math.min((newVal / props.target) * 100, 100)
  animatePercent(displayPercent.value, targetPercent, 1000)
})

onMounted(() => {
  animatePercent(0, percent.value, 1500)
})
</script>

<style lang="scss" scoped>
.gradient-progress { width: 100%; }

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-label { font-size: $font-size-sm; color: $text-secondary; }

.progress-value {
  font-size: $font-size-base;
  font-weight: 700;
  color: $text-primary;
  font-family: 'DIN Alternate', monospace;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  overflow: visible;
}

.progress-bar {
  position: relative;
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s ease;
  overflow: hidden;

  &.progress-animate .progress-shimmer { animation: shimmer 2s linear infinite; }
}

.progress-glow {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(79, 140, 255, 0.6), 0 0 20px rgba(168, 85, 247, 0.3);
}

.progress-shimmer {
  position: absolute;
  top: 0; left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.progress-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(79, 140, 255, 0.8), 0 0 20px rgba(168, 85, 247, 0.5);
  animation: pulse 2s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 8px; height: 8px;
    background: $gradient-primary;
    border-radius: 50%;
  }
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: $font-size-xs;
  color: $text-tertiary;
}

.progress-current { color: $color-primary; font-weight: 600; }

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(79, 140, 255, 0.8), 0 0 20px rgba(168, 85, 247, 0.5); }
  50% { box-shadow: 0 0 20px rgba(79, 140, 255, 1), 0 0 40px rgba(168, 85, 247, 0.7); }
}
</style>
