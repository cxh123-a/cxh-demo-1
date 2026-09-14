<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ProductItem } from '@/mock/data'

interface Props { data: ProductItem[] }
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
  const sortedData = [...props.data].reverse()
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15, 23, 58, 0.95)',
      borderColor: 'rgba(79, 140, 255, 0.5)',
      textStyle: { color: '#fff', fontSize: 13 },
      formatter: (params: any) => {
        const item = sortedData[params[0].dataIndex]
        return `${item.name}<br/>销量: ${item.sales.toLocaleString()}<br/>GMV: ¥${item.gmv.toLocaleString()}`
      }
    },
    grid: { left: '3%', right: '8%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { show: false }, splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: sortedData.map((item) => item.name),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 }
    },
    series: [{
      name: '销量', type: 'bar', data: sortedData.map((item) => item.sales),
      barWidth: 14,
      itemStyle: {
        borderRadius: [0, 7, 7, 0],
        color: (params: any) => {
          const index = sortedData.length - 1 - params.dataIndex
          const colors = [
            ['#ffb703', '#fb8500'], ['#c0c0c0', '#a0a0a0'], ['#cd7f32', '#b87333'],
            ['#4f8cff', '#a855f7'], ['#4f8cff', '#a855f7'], ['#4f8cff', '#a855f7'],
            ['#4f8cff', '#a855f7'], ['#4f8cff', '#a855f7'], ['#4f8cff', '#a855f7'], ['#4f8cff', '#a855f7']
          ]
          const colorPair = colors[index] || ['#4f8cff', '#a855f7']
          return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: colorPair[0] },
            { offset: 1, color: colorPair[1] }
          ])
        }
      },
      label: {
        show: true, position: 'right',
        color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 'bold',
        formatter: (params: any) => params.value.toLocaleString()
      },
      emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(79, 140, 255, 0.6)' } }
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
