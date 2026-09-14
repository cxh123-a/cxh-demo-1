<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ChannelData } from '@/mock/data'

interface Props { data: ChannelData[] }
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
      trigger: 'item',
      formatter: (params: any) => {
        const total = props.data.reduce((sum, item) => sum + item.value, 0)
        const percent = ((params.value / total) * 100).toFixed(1)
        return `${params.name}<br/>访客数: ${params.value.toLocaleString()}<br/>占比: ${percent}%`
      }
    },
    legend: {
      orient: 'vertical', right: '5%', top: 'center',
      itemWidth: 12, itemHeight: 12,
      textStyle: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
      formatter: (name: string) => {
        const item = props.data.find((d) => d.name === name)
        if (item) {
          const total = props.data.reduce((sum, d) => sum + d.value, 0)
          const percent = ((item.value / total) * 100).toFixed(1)
          return `${name}  ${percent}%`
        }
        return name
      }
    },
    series: [{
      name: '流量来源', type: 'pie',
      radius: ['45%', '70%'], center: ['35%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: 'rgba(15, 23, 58, 0.8)', borderWidth: 3 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#fff' },
        itemStyle: { shadowBlur: 20, shadowOffsetX: 0, shadowColor: 'rgba(79, 140, 255, 0.5)' }
      },
      labelLine: { show: false },
      data: props.data.map((item) => ({
        value: item.value, name: item.name,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: item.color },
            { offset: 1, color: item.color + '88' }
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
