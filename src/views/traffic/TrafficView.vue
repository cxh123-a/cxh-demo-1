<template>
  <div class="page-container">
    <div class="kpi-row">
      <div v-for="item in kpiList" :key="item.label" class="kpi-card">
        <div class="kpi-icon" :style="{ background: item.bg }"><el-icon :size="22"><component :is="item.icon" /></el-icon></div>
        <div class="kpi-info">
          <div class="kpi-label">{{ item.label }}</div>
          <div class="kpi-value">{{ item.value }}</div>
          <div class="kpi-trend" :class="item.trend > 0 ? 'up' : 'down'">{{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%</div>
        </div>
      </div>
    </div>

    <div class="chart-row">
      <el-card class="chart-card chart-wide" shadow="never">
        <template #header><span class="card-title">近30天访客趋势</span></template>
        <div ref="trendRef" class="chart-box"></div>
      </el-card>
    </div>

    <div class="chart-row">
      <el-card class="chart-card" shadow="never">
        <template #header><span class="card-title">流量来源渠道</span></template>
        <div ref="channelRef" class="chart-box"></div>
      </el-card>
      <el-card class="chart-card" shadow="never">
        <template #header><span class="card-title">用户转化漏斗</span></template>
        <div ref="funnelRef" class="chart-box"></div>
      </el-card>
    </div>

    <div class="chart-row">
      <el-card class="chart-card" shadow="never">
        <template #header><span class="card-title">访客地域分布 TOP10</span></template>
        <div ref="regionRef" class="chart-box"></div>
      </el-card>
      <el-card class="chart-card" shadow="never">
        <template #header><span class="card-title">终端设备分布</span></template>
        <div ref="deviceRef" class="chart-box"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { registerScreenTheme } from '@/utils/echarts'
import { View, User, Mouse, TrendCharts } from '@element-plus/icons-vue'

const trendRef = ref<HTMLElement>(); const channelRef = ref<HTMLElement>(); const funnelRef = ref<HTMLElement>(); const regionRef = ref<HTMLElement>(); const deviceRef = ref<HTMLElement>()
let charts: echarts.ECharts[] = []

const kpiList = ref([
  { label: '今日访客', value: '52,368', trend: 12.5, icon: View, bg: 'linear-gradient(135deg, #4f8cff, #a855f7)' },
  { label: '独立访客', value: '38,520', trend: 8.3, icon: User, bg: 'linear-gradient(135deg, #06d6a0, #00b4d8)' },
  { label: '页面浏览量', value: '186,520', trend: 15.2, icon: Mouse, bg: 'linear-gradient(135deg, #ffb703, #fb8500)' },
  { label: '转化率', value: '3.85%', trend: -0.5, icon: TrendCharts, bg: 'linear-gradient(135deg, #ef476f, #ff6b6b)' }
])

function initAll() {
  registerScreenTheme()
  const t = echarts.init(trendRef.value!, 'screen')
  const dates: string[] = [], pv: number[] = [], uv: number[] = []
  for (let i = 29; i >= 0; i--) { const d = new Date(Date.now() - i * 86400000); dates.push(`${d.getMonth() + 1}/${d.getDate()}`); pv.push(Math.floor(Math.random() * 80000 + 120000)); uv.push(Math.floor(Math.random() * 30000 + 40000)) }
  t.setOption({ tooltip: { trigger: 'axis' }, legend: { data: ['PV', 'UV'], textStyle: { color: 'rgba(255,255,255,0.7)' } }, grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }, xAxis: { type: 'category', data: dates }, yAxis: { type: 'value' }, series: [{ name: 'PV', type: 'line', smooth: true, data: pv, areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(79,140,255,0.4)'},{offset:1,color:'rgba(79,140,255,0.02)'}]) } }, { name: 'UV', type: 'line', smooth: true, data: uv, areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(6,214,160,0.4)'},{offset:1,color:'rgba(6,214,160,0.02)'}]) } }] })
  charts.push(t)

  const c = echarts.init(channelRef.value!, 'screen')
  c.setOption({ tooltip: { trigger: 'item' }, legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: 'rgba(255,255,255,0.7)' } }, series: [{ type: 'pie', radius: ['45%','70%'], center: ['35%','50%'], label: { show: false }, emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } }, data: [{ name: '自然搜索', value: 35, itemStyle: { color: '#4f8cff' } }, { name: '付费推广', value: 25, itemStyle: { color: '#a855f7' } }, { name: '社交媒体', value: 18, itemStyle: { color: '#06d6a0' } }, { name: '直接访问', value: 12, itemStyle: { color: '#ffb703' } }, { name: '直播带货', value: 10, itemStyle: { color: '#ef476f' } }] }] })
  charts.push(c)

  const f = echarts.init(funnelRef.value!, 'screen')
  f.setOption({ tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' }, series: [{ type: 'funnel', left: '10%', top: 10, bottom: 10, width: '80%', min: 0, max: 100, minSize: '20%', maxSize: '100%', sort: 'descending', gap: 4, label: { show: true, position: 'inside', formatter: '{b}\n{d}%', fontSize: 13, color: '#fff', fontWeight: 'bold' }, itemStyle: { borderColor: 'rgba(15,23,58,0.8)', borderWidth: 2 }, data: [{ value: 100, name: '访问首页', itemStyle: { color: '#4f8cff' } }, { value: 65, name: '浏览详情', itemStyle: { color: '#6a7dff' } }, { value: 40, name: '加入购物车', itemStyle: { color: '#8a6dff' } }, { value: 28, name: '提交订单', itemStyle: { color: '#a855f7' } }, { value: 22, name: '完成支付', itemStyle: { color: '#c74dff' } }] }] })
  charts.push(f)

  const r = echarts.init(regionRef.value!, 'screen')
  const regions = ['广东', '江苏', '浙江', '山东', '河南', '四川', '湖北', '湖南', '河北', '福建']
  const values = [18500, 15200, 13800, 11500, 9800, 8600, 7500, 6800, 6200, 5800]
  r.setOption({ tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, grid: { left: '3%', right: '8%', bottom: '3%', top: '3%', containLabel: true }, xAxis: { type: 'value', axisLabel: { show: false }, splitLine: { show: false } }, yAxis: { type: 'category', data: regions.reverse(), axisLabel: { color: 'rgba(255,255,255,0.8)' } }, series: [{ type: 'bar', data: values.reverse(), barWidth: 14, itemStyle: { borderRadius: [0,7,7,0], color: new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:'#4f8cff'},{offset:1,color:'#a855f7'}]) }, label: { show: true, position: 'right', color: 'rgba(255,255,255,0.9)', fontSize: 12, formatter: (p:any) => p.value.toLocaleString() } }] })
  charts.push(r)

  const d = echarts.init(deviceRef.value!, 'screen')
  d.setOption({ tooltip: { trigger: 'item' }, legend: { bottom: '5%', textStyle: { color: 'rgba(255,255,255,0.7)' } }, series: [{ type: 'pie', radius: ['40%','65%'], center: ['50%','45%'], label: { formatter: '{b}\n{d}%', color: 'rgba(255,255,255,0.8)', fontSize: 12 }, data: [{ name: '手机端', value: 68, itemStyle: { color: '#4f8cff' } }, { name: 'PC端', value: 22, itemStyle: { color: '#a855f7' } }, { name: '平板端', value: 7, itemStyle: { color: '#06d6a0' } }, { name: '其他', value: 3, itemStyle: { color: '#ffb703' } }] }] })
  charts.push(d)
}

function handleResize() { charts.forEach((c) => c.resize()) }

onMounted(() => { initAll(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); charts.forEach((c) => c.dispose()) })
</script>

<style lang="scss" scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.kpi-card { display: flex; align-items: center; gap: 14px; padding: 18px; background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; transition: all 0.3s; &:hover { border-color: rgba(79,140,255,0.4); transform: translateY(-2px); } }
.kpi-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.kpi-label { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
.kpi-value { font-size: 24px; font-weight: 700; color: #fff; font-family: 'DIN Alternate', monospace; }
.kpi-trend { font-size: 12px; margin-top: 2px; &.up { color: #06d6a0; } &.down { color: #ef476f; } }
.chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.chart-wide { grid-column: span 2; }
.chart-box { height: 300px; width: 100%; }
.card-title { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9); }
:deep(.el-card) { background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; }
:deep(.el-card__header) { padding: 14px 20px; border-bottom: 1px solid rgba(79,140,255,0.1); }
</style>
