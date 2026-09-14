<template>
  <div class="screen-wrapper" ref="wrapperRef">
    <div class="screen-container" ref="screenRef">
    <div class="bg-decoration">
      <div class="bg-grid"></div>
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
      <div class="bg-glow bg-glow-3"></div>
    </div>

    <header class="screen-header">
      <div class="header-left">
        <div class="header-time">
          <span class="time-value">{{ currentTimeStr }}</span>
          <span class="date-value">{{ currentDateStr }}</span>
        </div>
      </div>
      <div class="header-center">
        <h1 class="screen-title">
          <span class="title-text">品牌电商全链路运营数据可视化大屏</span>
          <span class="title-line title-line-left"></span>
          <span class="title-line title-line-right"></span>
        </h1>
        <div class="header-status">
          <span class="status-dot" :class="{ paused: store.isPaused }"></span>
          <span class="status-text">{{ store.isPaused ? '数据已暂停' : '实时数据更新中' }}</span>
        </div>
      </div>
      <div class="header-right">
        <button class="control-btn" @click="store.togglePause()">
          {{ store.isPaused ? '▶ 继续' : '⏸ 暂停' }}
        </button>
      </div>
    </header>

    <section class="kpi-section">
      <div
        v-for="(kpi, index) in kpiList"
        :key="kpi.key"
        class="kpi-card animate-fade-in-up"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="kpi-icon" :style="{ background: kpi.gradient }">
          <span>{{ kpi.icon }}</span>
        </div>
        <div class="kpi-content">
          <div class="kpi-label">{{ kpi.label }}</div>
          <div class="kpi-value">
            <CountUpNumber
              :value="kpi.value"
              :decimals="kpi.decimals"
              :suffix="kpi.suffix"
              :prefix="kpi.prefix"
              :glow="true"
            />
          </div>
          <div class="kpi-growth" :class="kpi.growth >= 0 ? 'growth-up' : 'growth-down'">
            <span>{{ kpi.growth >= 0 ? '↑' : '↓' }}</span>
            <span>{{ Math.abs(kpi.growth * 100).toFixed(2) }}%</span>
            <span class="growth-label">同比</span>
          </div>
        </div>
      </div>
    </section>

    <main class="main-content">
      <div class="panel panel-left">
        <ScreenCard title="流量来源渠道" subtitle="实时占比分析" class="panel-card animate-fade-in-up" style="animation-delay: 0.2s">
          <ChannelPie :data="store.channels" />
        </ScreenCard>

        <ScreenCard title="用户转化漏斗" subtitle="全链路转化分析" class="panel-card animate-fade-in-up" style="animation-delay: 0.3s">
          <TrafficFunnel :data="store.funnel" />
        </ScreenCard>

        <ScreenCard title="近24小时访客趋势" subtitle="实时流量监控" class="panel-card animate-fade-in-up" style="animation-delay: 0.4s">
          <VisitorTrend :data="store.visitorTrend" />
        </ScreenCard>
      </div>

      <div class="panel panel-center">
        <div class="gmv-hero animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="gmv-label">实时成交总额 GMV</div>
          <div class="gmv-value">
            <span class="gmv-currency">¥</span>
            <CountUpNumber :value="store.kpi.gmv" :decimals="2" :separator="true" :glow="true" />
          </div>
          <div class="gmv-unit">元</div>
          <div class="gmv-target">
            <span>今日目标: ¥{{ (160000000 / 100000000).toFixed(2) }}亿</span>
            <span class="gmv-completion">完成率: {{ (store.kpi.targetCompletion * 100).toFixed(1) }}%</span>
          </div>
        </div>

        <ScreenCard title="大促目标完成进度" subtitle="实时追踪" class="panel-card animate-fade-in-up" style="animation-delay: 0.4s">
          <div class="target-progress">
            <GradientProgress
              :current="store.kpi.gmv"
              :target="160000000"
              label="GMV目标完成率"
              :show-detail="true"
            />
            <div class="target-stats">
              <div class="stat-item">
                <div class="stat-label">剩余目标</div>
                <div class="stat-value">¥{{ ((160000000 - store.kpi.gmv) / 100000000).toFixed(2) }}亿</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">预计达成</div>
                <div class="stat-value">{{ store.kpi.targetCompletion > 1 ? '已超额' : '进行中' }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">目标增长率</div>
                <div class="stat-value growth-up">+{{ (store.kpi.targetGrowth * 100).toFixed(1) }}%</div>
              </div>
            </div>
          </div>
        </ScreenCard>

        <ScreenCard title="峰值销量播报" subtitle="实时热点" class="panel-card animate-fade-in-up" style="animation-delay: 0.5s">
          <div class="peak-broadcast">
            <div class="peak-item">
              <div class="peak-icon">🔥</div>
              <div class="peak-info">
                <div class="peak-label">最新峰值时间</div>
                <div class="peak-value">{{ store.peak.time }}</div>
              </div>
            </div>
            <div class="peak-item">
              <div class="peak-icon">📦</div>
              <div class="peak-info">
                <div class="peak-label">峰值订单量</div>
                <div class="peak-value">{{ store.peak.sales.toLocaleString() }} 单</div>
              </div>
            </div>
            <div class="peak-item">
              <div class="peak-icon">💰</div>
              <div class="peak-info">
                <div class="peak-label">峰值成交额</div>
                <div class="peak-value">¥{{ (store.peak.gmv / 10000).toFixed(0) }} 万</div>
              </div>
            </div>
          </div>
        </ScreenCard>

        <ScreenCard title="近7天销售趋势" subtitle="GMV & 订单量" class="panel-card animate-fade-in-up" style="animation-delay: 0.6s">
          <SalesTrend :data="store.salesTrend" />
        </ScreenCard>
      </div>

      <div class="panel panel-right">
        <ScreenCard title="热销商品 TOP10" subtitle="实时销量排行" class="panel-card animate-fade-in-up" style="animation-delay: 0.3s">
          <ProductRank :data="store.productRank" />
        </ScreenCard>

        <ScreenCard title="品类销售占比" subtitle="结构分析" class="panel-card animate-fade-in-up" style="animation-delay: 0.4s">
          <CategoryPie :data="store.category" />
        </ScreenCard>

        <ScreenCard title="实时订单动态" subtitle="秒级刷新" class="panel-card animate-fade-in-up" style="animation-delay: 0.5s">
          <ScrollList :data="store.logistics.slice(0, 10)" :speed="40" class="order-scroll">
            <template #default="{ item }">
              <div class="order-item">
                <div class="order-no">{{ item.orderNo }}</div>
                <div class="order-region">{{ item.region }}</div>
                <div class="order-status" :class="getStatusClass(item.status)">{{ item.status }}</div>
              </div>
            </template>
          </ScrollList>
        </ScreenCard>
      </div>
    </main>

    <footer class="footer-section">
      <ScreenCard title="各省订单地域分布" subtitle="热力分布 TOP15" class="footer-card animate-fade-in-up" style="animation-delay: 0.5s">
        <RegionMap :data="store.region" />
      </ScreenCard>

      <ScreenCard title="物流时效状态" subtitle="实时履约监控" class="footer-card footer-card-wide animate-fade-in-up" style="animation-delay: 0.6s">
        <div class="logistics-header">
          <div class="logistics-col col-order">订单编号</div>
          <div class="logistics-col col-region">目的地</div>
          <div class="logistics-col col-status">状态</div>
          <div class="logistics-col col-time">下单时间</div>
          <div class="logistics-col col-duration">物流时长</div>
        </div>
        <ScrollList :data="store.logistics" :speed="35" class="logistics-scroll">
          <template #default="{ item }">
            <div class="logistics-row">
              <div class="logistics-col col-order">{{ item.orderNo }}</div>
              <div class="logistics-col col-region">{{ item.region }}</div>
              <div class="logistics-col col-status">
                <span class="status-badge" :class="getStatusClass(item.status)">{{ item.status }}</span>
              </div>
              <div class="logistics-col col-time">{{ item.time }}</div>
              <div class="logistics-col col-duration">{{ item.duration }}</div>
            </div>
          </template>
        </ScrollList>
      </ScreenCard>
    </footer>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useScreenStore } from '@/store/screen'
import { initScale, initScaleByContainer } from '@/utils/scale'
import { registerScreenTheme } from '@/utils/echarts'
import ScreenCard from '@/components/ScreenCard.vue'
import CountUpNumber from '@/components/CountUpNumber.vue'
import ScrollList from '@/components/ScrollList.vue'
import GradientProgress from '@/components/GradientProgress.vue'
import ChannelPie from '@/charts/ChannelPie.vue'
import TrafficFunnel from '@/charts/TrafficFunnel.vue'
import VisitorTrend from '@/charts/VisitorTrend.vue'
import ProductRank from '@/charts/ProductRank.vue'
import CategoryPie from '@/charts/CategoryPie.vue'
import RegionMap from '@/charts/RegionMap.vue'
import SalesTrend from '@/charts/SalesTrend.vue'

const store = useScreenStore()
const screenRef = ref<HTMLElement>()
const wrapperRef = ref<HTMLElement>()
const currentTime = ref(new Date())

let cleanupScale: (() => void) | null = null
let timeInterval: ReturnType<typeof setInterval> | null = null

const kpiList = computed(() => [
  {
    key: 'gmv',
    label: '成交总额 GMV',
    value: store.kpi.gmv,
    decimals: 0,
    suffix: '',
    prefix: '¥',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #4f8cff, #a855f7)',
    growth: store.kpi.gmvGrowth
  },
  {
    key: 'orders',
    label: '订单总量',
    value: store.kpi.orders,
    decimals: 0,
    suffix: ' 单',
    prefix: '',
    icon: '📦',
    gradient: 'linear-gradient(135deg, #06d6a0, #00b4d8)',
    growth: store.kpi.ordersGrowth
  },
  {
    key: 'visitors',
    label: '访客总数',
    value: store.kpi.visitors,
    decimals: 0,
    suffix: ' 人',
    prefix: '',
    icon: '👥',
    gradient: 'linear-gradient(135deg, #ffb703, #fb8500)',
    growth: store.kpi.visitorsGrowth
  },
  {
    key: 'conversion',
    label: '转化率',
    value: store.kpi.conversionRate * 100,
    decimals: 2,
    suffix: '%',
    prefix: '',
    icon: '📈',
    gradient: 'linear-gradient(135deg, #ef476f, #ff6b6b)',
    growth: store.kpi.conversionGrowth
  },
  {
    key: 'avgOrder',
    label: '客单价',
    value: store.kpi.avgOrderValue,
    decimals: 2,
    suffix: ' 元',
    prefix: '¥',
    icon: '🛒',
    gradient: 'linear-gradient(135deg, #a855f7, #c74dff)',
    growth: store.kpi.avgOrderGrowth
  },
  {
    key: 'target',
    label: '目标完成率',
    value: store.kpi.targetCompletion * 100,
    decimals: 1,
    suffix: '%',
    prefix: '',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #00b4d8, #06d6a0)',
    growth: store.kpi.targetGrowth
  }
])

const currentTimeStr = computed(() => {
  const d = currentTime.value
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const currentDateStr = computed(() => {
  const d = currentTime.value
  const pad = (n: number) => n.toString().padStart(2, '0')
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${weekDays[d.getDay()]}`
})

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    已签收: 'status-success',
    派送中: 'status-info',
    运输中: 'status-warning',
    已发货: 'status-primary',
    待揽收: 'status-muted'
  }
  return map[status] || 'status-muted'
}

onMounted(() => {
  registerScreenTheme()

  if (screenRef.value && wrapperRef.value) {
    const parent = wrapperRef.value.parentElement
    if (parent) {
      cleanupScale = initScaleByContainer(screenRef.value, parent)
    } else {
      cleanupScale = initScale(screenRef.value)
    }
  }

  store.init()

  timeInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  cleanupScale?.()
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<style lang="scss" scoped>
.screen-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.screen-container {
  position: relative;
  width: 3840px;
  height: 2160px;
  background: $bg-dark;
  overflow: hidden;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(79, 140, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79, 140, 255, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;

  &.bg-glow-1 {
    width: 800px;
    height: 800px;
    top: -200px;
    left: -200px;
    background: radial-gradient(circle, #4f8cff, transparent);
  }

  &.bg-glow-2 {
    width: 600px;
    height: 600px;
    top: 50%;
    right: -100px;
    background: radial-gradient(circle, #a855f7, transparent);
  }

  &.bg-glow-3 {
    width: 700px;
    height: 700px;
    bottom: -200px;
    left: 30%;
    background: radial-gradient(circle, #06d6a0, transparent);
    opacity: 0.15;
  }
}

.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  position: relative;
  z-index: 1;
}

.header-left,
.header-right {
  width: 400px;
  display: flex;
  align-items: center;
}

.header-right {
  justify-content: flex-end;
}

.header-time {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .time-value {
    font-size: 36px;
    font-weight: 700;
    color: $text-primary;
    font-family: 'DIN Alternate', monospace;
    text-shadow: 0 0 15px rgba(79, 140, 255, 0.5);
  }

  .date-value {
    font-size: 16px;
    color: $text-secondary;
  }
}

.header-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.screen-title {
  position: relative;
  font-size: 44px;
  font-weight: 800;
  letter-spacing: 4px;
  margin: 0;

  .title-text {
    background: linear-gradient(180deg, #ffffff 0%, #4f8cff 50%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px rgba(79, 140, 255, 0.5));
  }

  .title-line {
    position: absolute;
    top: 50%;
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, transparent, $color-primary, transparent);

    &.title-line-left {
      right: 100%;
      margin-right: 30px;
    }

    &.title-line-right {
      left: 100%;
      margin-left: 30px;
    }
  }
}

.header-status {
  display: flex;
  align-items: center;
  gap: 8px;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $color-accent;
    box-shadow: 0 0 10px $color-accent;
    animation: pulse 1.5s ease-in-out infinite;

    &.paused {
      background: $color-warning;
      box-shadow: 0 0 10px $color-warning;
    }
  }

  .status-text {
    font-size: 14px;
    color: $text-secondary;
  }
}

.control-btn {
  padding: 10px 24px;
  background: $gradient-primary;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all $transition-base;
  box-shadow: 0 4px 15px rgba(79, 140, 255, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 140, 255, 0.6);
  }
}

.kpi-section {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  position: relative;
  z-index: 1;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $card-radius;
  backdrop-filter: blur(10px);
  transition: all $transition-base;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: $gradient-primary;
    opacity: 0.6;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: $border-glow;
    box-shadow: $shadow-glow-hover;
  }
}

.kpi-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.kpi-content {
  flex: 1;
  min-width: 0;
}

.kpi-label {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 6px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.2;
  font-family: 'DIN Alternate', monospace;
}

.kpi-growth {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  margin-top: 4px;

  &.growth-up {
    color: $color-accent;
  }

  &.growth-down {
    color: $color-danger;
  }

  .growth-label {
    color: $text-tertiary;
    margin-left: 4px;
  }
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 680px 1fr 680px;
  gap: 16px;
  position: relative;
  z-index: 1;
  min-height: 0;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.panel-card {
  flex: 1;
  min-height: 0;
}

.panel-center {
  .panel-card {
    flex: none;
  }
}

.gmv-hero {
  background: $bg-card;
  border: 1px solid $border-color;
  border-radius: $card-radius;
  padding: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(79, 140, 255, 0.1), transparent 50%);
    animation: rotate 20s linear infinite;
  }
}

.gmv-label {
  font-size: 20px;
  color: $text-secondary;
  letter-spacing: 2px;
  margin-bottom: 16px;
  position: relative;
}

.gmv-value {
  font-size: 72px;
  font-weight: 800;
  font-family: 'DIN Alternate', monospace;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  position: relative;

  .gmv-currency {
    font-size: 40px;
    color: $color-primary;
  }
}

.gmv-unit {
  font-size: 20px;
  color: $text-secondary;
  margin-top: 8px;
  position: relative;
}

.gmv-target {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  font-size: 16px;
  color: $text-secondary;
  position: relative;

  .gmv-completion {
    color: $color-accent;
    font-weight: 600;
  }
}

.target-progress {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

.target-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: rgba(79, 140, 255, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(79, 140, 255, 0.15);

  .stat-label {
    font-size: 13px;
    color: $text-tertiary;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: $text-primary;
    font-family: 'DIN Alternate', monospace;

    &.growth-up {
      color: $color-accent;
    }
  }
}

.peak-broadcast {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  height: 100%;
  align-items: center;
}

.peak-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(79, 140, 255, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(79, 140, 255, 0.15);
  transition: all $transition-base;

  &:hover {
    background: rgba(79, 140, 255, 0.15);
    transform: translateY(-2px);
  }
}

.peak-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.peak-info {
  .peak-label {
    font-size: 13px;
    color: $text-tertiary;
    margin-bottom: 6px;
  }

  .peak-value {
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
    font-family: 'DIN Alternate', monospace;
  }
}

.order-scroll {
  height: 100%;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(79, 140, 255, 0.1);
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }
}

.order-no {
  color: $text-secondary;
  font-family: monospace;
}

.order-region {
  color: $text-primary;
  font-weight: 500;
}

.order-status {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.status-success {
    background: rgba(6, 214, 160, 0.15);
    color: $color-accent;
  }

  &.status-info {
    background: rgba(0, 180, 216, 0.15);
    color: $color-info;
  }

  &.status-warning {
    background: rgba(255, 183, 3, 0.15);
    color: $color-warning;
  }

  &.status-primary {
    background: rgba(79, 140, 255, 0.15);
    color: $color-primary;
  }

  &.status-muted {
    background: rgba(255, 255, 255, 0.08);
    color: $text-tertiary;
  }
}

.footer-section {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 16px;
  height: 380px;
  position: relative;
  z-index: 1;
}

.footer-card {
  height: 100%;
}

.logistics-header,
.logistics-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
}

.logistics-header {
  background: rgba(79, 140, 255, 0.1);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: $text-secondary;
  margin-bottom: 8px;
}

.logistics-row {
  border-bottom: 1px solid rgba(79, 140, 255, 0.08);
  font-size: 13px;
  color: $text-primary;

  &:hover {
    background: rgba(79, 140, 255, 0.05);
  }
}

.logistics-col {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.col-order {
    font-family: monospace;
    color: $text-secondary;
  }
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.status-success {
    background: rgba(6, 214, 160, 0.15);
    color: $color-accent;
  }

  &.status-info {
    background: rgba(0, 180, 216, 0.15);
    color: $color-info;
  }

  &.status-warning {
    background: rgba(255, 183, 3, 0.15);
    color: $color-warning;
  }

  &.status-primary {
    background: rgba(79, 140, 255, 0.15);
    color: $color-primary;
  }

  &.status-muted {
    background: rgba(255, 255, 255, 0.08);
    color: $text-tertiary;
  }
}

.logistics-scroll {
  height: calc(100% - 50px);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
