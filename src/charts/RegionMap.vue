<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { RegionData } from '@/mock/data'

interface Props { data: RegionData[] }
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
  const sortedData = [...props.data].sort((a, b) => a.value - b.value).slice(-15)
  const maxValue = sortedData[sortedData.length - 1]?.value || 1
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15, 23, 58, 0.95)',
      borderColor: 'rgba(79, 140, 255, 0.5)',
      textStyle: { color: '#fff', fontSize: 13 },
      formatter: (params: any) => `${params[0].name}<br/>订单量: ${params[0].value.toLocaleString()}`
    },
    grid: { left: '3%', right: '8%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: {
        show: true, color: 'rgba(255,255,255,0.5)', fontSize: 11,
        formatter: (value: number) => value >= 10000 ? (value / 10000).toFixed(0) + 'w' : value.toString()
      },
      splitLine: { lineStyle: { color: 'rgba(79, 140, 255, 0.08)', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: sortedData.map((item) => item.name),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 500 }
    },
    series: [{
      name: '订单量', type: 'bar', data: sortedData.map((item) => item.value),
      barWidth: 16,
      itemStyle: {
        borderRadius: [0, 8, 8, 0],
        color: (params: any) => {
          const ratio = params.value / maxValue
          let color1: string, color2: string
          if (ratio > 0.8) { color1 = '#ef476f'; color2 = '#ff6b6b' }
          else if (ratio > 0.6) { color1 = '#ffb703'; color2 = '#fb8500' }
          else if (ratio > 0.4) { color1 = '#a855f7'; color2 = '#c74dff' }
          else if (ratio > 0.2) { color1 = '#4f8cff'; color2 = '#6a7dff' }
          else { color1 = '#00b4d8'; color2 = '#06d6a0' }
          return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: color1 + '99' },
            { offset: 1, color: color2 }
          ])
        }
      },
      label: {
        show: true, position: 'right',
        color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 'bold',
        formatter: (params: any) => params.value.toLocaleString()
      },
      emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(79, 140, 255, 0.6)' } }
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
