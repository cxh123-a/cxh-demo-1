<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { TrendPoint } from '@/mock/data'

interface Props { data: TrendPoint[] }
const props = defineProps<Props>()

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value, 'screen')
  updateChart()
}

function updateChart() {
  if (!chartInstance) return
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 58, 0.95)',
      borderColor: 'rgba(79, 140, 255, 0.5)',
      textStyle: { color: '#fff', fontSize: 13 },
      formatter: (params: any) => {
        const item = params[0]
        return `${item.axisValue}<br/>访客数: ${item.value.toLocaleString()}`
      }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category', boundaryGap: false,
      data: props.data.map((item) => item.time),
      axisLine: { lineStyle: { color: 'rgba(79, 140, 255, 0.3)' } },
      axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: {
        color: 'rgba(255,255,255,0.6)', fontSize: 11,
        formatter: (value: number) => value >= 10000 ? (value / 10000).toFixed(0) + 'w' : value.toString()
      },
      splitLine: { lineStyle: { color: 'rgba(79, 140, 255, 0.1)', type: 'dashed' } }
    },
    series: [{
      name: '访客数', type: 'line', smooth: true,
      symbol: 'circle', symbolSize: 6, showSymbol: false,
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#4f8cff' },
          { offset: 0.5, color: '#a855f7' },
          { offset: 1, color: '#ef476f' }
        ]),
        shadowColor: 'rgba(79, 140, 255, 0.5)', shadowBlur: 10
      },
      itemStyle: { color: '#fff', borderColor: '#4f8cff', borderWidth: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(79, 140, 255, 0.4)' },
          { offset: 0.5, color: 'rgba(168, 85, 247, 0.2)' },
          { offset: 1, color: 'rgba(79, 140, 255, 0.02)' }
        ])
      },
      emphasis: {
        scale: 1.5,
        itemStyle: { shadowBlur: 15, shadowColor: 'rgba(79, 140, 255, 0.8)' }
      },
      data: props.data.map((item) => item.value)
    }]
  }
  chartInstance.setOption(option, true)
}

function handleResize() { chartInstance?.resize() }

watch(() => props.data, () => { updateChart() }, { deep: true })

onMounted(() => { initChart(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); chartInstance?.dispose() })
</script>

<style lang="scss" scoped>
.chart-container { width: 100%; height: 100%; }
</style>
