<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { FunnelData } from '@/mock/data'

interface Props { data: FunnelData[] }
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
  const colors = ['#4f8cff', '#6a7dff', '#8a6dff', '#a855f7', '#c74dff']
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const item = props.data[params.dataIndex]
        return `${params.name}<br/>人数: ${params.value.toLocaleString()}<br/>转化率: ${(item.rate * 100).toFixed(1)}%`
      }
    },
    series: [{
      name: '转化漏斗', type: 'funnel',
      left: '10%', top: 10, bottom: 10, width: '80%',
      min: 0, max: props.data[0]?.value || 100,
      minSize: '20%', maxSize: '100%',
      sort: 'descending', gap: 4,
      label: {
        show: true, position: 'inside',
        formatter: (params: any) => {
          const item = props.data[params.dataIndex]
          return `${params.name}\n${(item.rate * 100).toFixed(1)}%`
        },
        fontSize: 13, color: '#fff', fontWeight: 'bold', lineHeight: 20
      },
      labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
      itemStyle: { borderColor: 'rgba(15, 23, 58, 0.8)', borderWidth: 2 },
      emphasis: {
        label: { fontSize: 15 },
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(79, 140, 255, 0.5)' }
      },
      data: props.data.map((item, index) => ({
        value: item.value, name: item.name,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: colors[index] + 'cc' },
            { offset: 1, color: colors[index] }
          ])
        }
      }))
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
