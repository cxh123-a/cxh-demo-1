<template>
  <div class="page-container">
    <div class="kpi-row">
      <div v-for="item in kpiList" :key="item.label" class="kpi-card">
        <div class="kpi-icon" :style="{ background: item.bg }">
          <el-icon :size="24"><component :is="item.icon" /></el-icon>
        </div>
        <div class="kpi-info">
          <div class="kpi-label">{{ item.label }}</div>
          <div class="kpi-value">{{ item.value }}</div>
          <div class="kpi-trend" :class="item.trend > 0 ? 'up' : 'down'">
            {{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}% 较昨日
          </div>
        </div>
      </div>
    </div>

    <div class="chart-row">
      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>商品销量趋势</span>
            <el-radio-group v-model="trendPeriod" size="small">
              <el-radio-button value="7">近7天</el-radio-button>
              <el-radio-button value="30">近30天</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div ref="trendChartRef" class="chart-box"></div>
      </el-card>

      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>品类销售占比</span>
          </div>
        </template>
        <div ref="categoryChartRef" class="chart-box"></div>
      </el-card>
    </div>

    <div class="chart-row">
      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>热销商品 TOP10</span>
          </div>
        </template>
        <div ref="rankChartRef" class="chart-box"></div>
      </el-card>

      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>价格带分布</span>
          </div>
        </template>
        <div ref="priceChartRef" class="chart-box"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { registerScreenTheme } from '@/utils/echarts'
import { Goods, TrendCharts, Money, ShoppingCart } from '@element-plus/icons-vue'

const trendPeriod = ref('7')
const trendChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()
const rankChartRef = ref<HTMLElement>()
const priceChartRef = ref<HTMLElement>()

let trendChart: echarts.ECharts | null = null
let categoryChart: echarts.ECharts | null = null
let rankChart: echarts.ECharts | null = null
let priceChart: echarts.ECharts | null = null

const kpiList = ref([
  { label: '商品总数', value: '1,286', trend: 3.2, icon: Goods, bg: 'linear-gradient(135deg, #4f8cff, #a855f7)' },
  { label: '今日销量', value: '12,580', trend: 12.5, icon: ShoppingCart, bg: 'linear-gradient(135deg, #06d6a0, #00b4d8)' },
  { label: '今日销售额', value: '¥286.5万', trend: 8.3, icon: Money, bg: 'linear-gradient(135deg, #ffb703, #fb8500)' },
  { label: '动销率', value: '78.6%', trend: -1.2, icon: TrendCharts, bg: 'linear-gradient(135deg, #ef476f, #ff6b6b)' }
])

function initTrendChart() {
  if (!trendChartRef.value) return
  trendChart = echarts.init(trendChartRef.value, 'screen')

  const days = trendPeriod.value === '7' ? 7 : 30
  const dates = []
  const sales = []
  const gmv = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`)
    sales.push(Math.floor(Math.random() * 8000 + 6000))
    gmv.push(Math.floor(Math.random() * 2000000 + 1500000))
  }

  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['销量', '销售额'], textStyle: { color: 'rgba(255,255,255,0.7)' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: dates },
    yAxis: [
      { type: 'value', name: '销量' },
      { type: 'value', name: '销售额(万)' }
    ],
    series: [
      {
        name: '销量',
        type: 'line',
        smooth: true,
        data: sales,
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(79,140,255,0.4)' }, { offset: 1, color: 'rgba(79,140,255,0.02)' }]) }
      },
      {
        name: '销售额',
        type: 'bar',
        yAxisIndex: 1,
        data: gmv.map((v) => Math.floor(v / 10000)),
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(6,214,160,0.8)' }, { offset: 1, color: 'rgba(6,214,160,0.2)' }]) }
      }
    ]
  })
}

function initCategoryChart() {
  if (!categoryChartRef.value) return
  categoryChart = echarts.init(categoryChartRef.value, 'screen')

  const data = [
    { name: '数码电子', value: 35 },
    { name: '服饰鞋包', value: 25 },
    { name: '美妆个护', value: 18 },
    { name: '食品生鲜', value: 12 },
    { name: '家居家装', value: 7 },
    { name: '母婴玩具', value: 3 }
  ]

  categoryChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: 'rgba(255,255,255,0.7)' } },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: data.map((item, i) => ({
        ...item,
        itemStyle: { color: ['#4f8cff', '#a855f7', '#06d6a0', '#ffb703', '#ef476f', '#00b4d8'][i] }
      }))
    }]
  })
}

function initRankChart() {
  if (!rankChartRef.value) return
  rankChart = echarts.init(rankChartRef.value, 'screen')

  const products = ['iPhone 15 Pro', '华为 Mate 60', '小米14 Ultra', 'AirPods Pro', '戴森V15', 'SK-II神仙水', 'AJ1高帮', '始祖鸟冲锋衣', '索尼XM5', '大疆Mini 4']
  const sales = [45820, 38560, 32100, 28900, 25600, 22300, 19800, 17500, 15200, 12800]

  rankChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { show: false }, splitLine: { show: false } },
    yAxis: { type: 'category', data: products.reverse(), axisLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 } },
    series: [{
      type: 'bar',
      data: sales.reverse(),
      barWidth: 14,
      itemStyle: {
        borderRadius: [0, 7, 7, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#4f8cff' }, { offset: 1, color: '#a855f7' }])
      },
      label: { show: true, position: 'right', color: 'rgba(255,255,255,0.9)', fontSize: 12, formatter: (p: any) => p.value.toLocaleString() }
    }]
  })
}

function initPriceChart() {
  if (!priceChartRef.value) return
  priceChart = echarts.init(priceChartRef.value, 'screen')

  priceChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['0-50', '50-100', '100-300', '300-500', '500-1000', '1000-3000', '3000+'] },
    yAxis: { type: 'value', name: '商品数' },
    series: [{
      type: 'bar',
      data: [120, 280, 450, 320, 180, 95, 41],
      barWidth: '50%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#06d6a0' }, { offset: 1, color: '#00b4d8' }])
      }
    }]
  })
}

function handleResize() {
  trendChart?.resize()
  categoryChart?.resize()
  rankChart?.resize()
  priceChart?.resize()
}

watch(trendPeriod, () => {
  initTrendChart()
})

onMounted(() => {
  registerScreenTheme()
  initTrendChart()
  initCategoryChart()
  initRankChart()
  initPriceChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  categoryChart?.dispose()
  rankChart?.dispose()
  priceChart?.dispose()
})
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(15, 23, 58, 0.6);
  border: 1px solid rgba(79, 140, 255, 0.15);
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    border-color: rgba(79, 140, 255, 0.4);
    transform: translateY(-2px);
  }
}

.kpi-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.kpi-info {
  .kpi-label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 6px;
  }
  .kpi-value {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    font-family: 'DIN Alternate', monospace;
    margin-bottom: 4px;
  }
  .kpi-trend {
    font-size: 12px;
    &.up { color: #06d6a0; }
    &.down { color: #ef476f; }
  }
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-card {
  :deep(.el-card__header) {
    padding: 14px 20px;
    border-bottom: 1px solid rgba(79, 140, 255, 0.1);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.chart-box {
  height: 320px;
  width: 100%;
}

:deep(.el-card) {
  background: rgba(15, 23, 58, 0.6);
  border: 1px solid rgba(79, 140, 255, 0.15);
  border-radius: 8px;
}

:deep(.el-radio-button__inner) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(79, 140, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  background: #4f8cff;
  border-color: #4f8cff;
  color: #fff;
}
</style>
