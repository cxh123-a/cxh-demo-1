<template>
  <div class="scroll-list-container" ref="containerRef">
    <div class="scroll-list-wrapper" :style="wrapperStyle">
      <div class="scroll-list-content" ref="contentRef">
        <slot v-for="(item, index) in displayData" :item="item" :index="index" />
      </div>
      <div class="scroll-list-content" v-if="seamless" aria-hidden="true">
        <slot v-for="(item, index) in displayData" :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  data: any[]
  speed?: number
  seamless?: boolean
  pauseOnHover?: boolean
  itemHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  seamless: true,
  pauseOnHover: true,
  itemHeight: 60
})

const containerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const scrollTop = ref(0)
const isPaused = ref(false)
let animationId: number | null = null
let lastTime = 0

const displayData = computed(() => props.data || [])

const wrapperStyle = computed(() => ({
  transform: `translateY(-${scrollTop.value}px)`,
  transition: isPaused.value ? 'none' : 'none'
}))

function animate(currentTime: number) {
  if (!lastTime) lastTime = currentTime
  const deltaTime = currentTime - lastTime
  lastTime = currentTime

  if (!isPaused.value && contentRef.value) {
    const contentHeight = contentRef.value.offsetHeight
    scrollTop.value += (props.speed * deltaTime) / 1000
    if (props.seamless && scrollTop.value >= contentHeight) scrollTop.value = 0
  }

  animationId = requestAnimationFrame(animate)
}

function handleMouseEnter() {
  if (props.pauseOnHover) isPaused.value = true
}

function handleMouseLeave() {
  if (props.pauseOnHover) isPaused.value = false
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('mouseenter', handleMouseEnter)
    containerRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
  animationId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (containerRef.value) {
    containerRef.value.removeEventListener('mouseenter', handleMouseEnter)
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})

watch(() => props.data, () => { scrollTop.value = 0 })
</script>

<style lang="scss" scoped>
.scroll-list-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 30px;
    z-index: 2;
    pointer-events: none;
  }

  &::before { top: 0; background: linear-gradient(to bottom, rgba(15, 23, 58, 0.9), transparent); }
  &::after { bottom: 0; background: linear-gradient(to top, rgba(15, 23, 58, 0.9), transparent); }
}

.scroll-list-wrapper { will-change: transform; }
.scroll-list-content { width: 100%; }
</style>
