<template>
  <div class="screen-card" :class="{ 'card-hover': hoverable }" :style="cardStyle">
    <div class="card-header" v-if="title || $slots.header">
      <div class="header-left">
        <span class="header-icon" v-if="icon"><component :is="icon" /></span>
        <slot name="header">
          <h3 class="card-title">{{ title }}</h3>
          <span class="card-subtitle" v-if="subtitle">{{ subtitle }}</span>
        </slot>
      </div>
      <div class="header-right" v-if="$slots.extra"><slot name="extra" /></div>
    </div>
    <div class="card-body" :style="bodyStyle"><slot /></div>
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  icon?: any
  hoverable?: boolean
  height?: string | number
  bodyPadding?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: true,
  bodyPadding: '20px'
})

const cardStyle = computed(() => ({
  height: props.height ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : 'auto'
}))

const bodyStyle = computed(() => ({ padding: props.bodyPadding }))
</script>

<style lang="scss" scoped>
.screen-card {
  position: relative;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $card-radius;
  box-shadow: $shadow-card;
  overflow: hidden;
  transition: all $transition-base;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, $color-primary, $color-secondary, transparent);
    animation: shimmer 3s linear infinite;
    z-index: 1;
  }

  &.card-hover {
    &:hover {
      transform: translateY(-4px);
      border-color: $border-glow;
      box-shadow: $shadow-glow-hover;
      background: $bg-card-hover;
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(79, 140, 255, 0.15);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 24px;
    width: 60px;
    height: 2px;
    background: $gradient-primary;
    border-radius: 1px;
  }
}

.header-left { display: flex; align-items: center; gap: 12px; }

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: $gradient-primary;
  border-radius: 6px;
  opacity: 0.9;
}

.card-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: 1px;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-subtitle { font-size: $font-size-xs; color: $text-tertiary; margin-left: 8px; }
.header-right { display: flex; align-items: center; gap: 8px; }
.card-body { position: relative; height: calc(100% - 65px); overflow: hidden; }

.corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: $color-primary;
  border-style: solid;
  opacity: 0.8;
  z-index: 2;

  &.corner-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; border-top-left-radius: $card-radius; }
  &.corner-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; border-top-right-radius: $card-radius; }
  &.corner-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; border-bottom-left-radius: $card-radius; }
  &.corner-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-bottom-right-radius: $card-radius; }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
</style>
