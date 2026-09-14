<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { CategoryData } from '@/mock/data'

interface Props { data: CategoryData[] }
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
  const total = props.data.reduce((sum, item) => sum + item.value, 0)
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const percent = ((params.value / total) * 100).toFixed(1)
        return `${params.name}<br/>销售额: ¥${params.value.toLocaleString()}<br/>占比: ${percent}%`
      }
    },
    legend: {
      orient: 'vertical', right: '5%', top: 'center',
      itemWidth: 10, itemHeight: 10,
      textStyle: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
      formatter: (name: string) => {
        const item = props.data.find((d) => d.name === name)
        if (item) {
          const percent = ((item.value / total) * 100).toFixed(1)
          return `${name} ${percent}%`
        }
        return name
      }
    },
    series: [{
      name: '品类销售', type: 'pie',
      radius: ['50%', '72%'], center: ['32%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: 'rgba(15, 23, 58, 0.9)', borderWidth: 3 },
      label: {
        show: true, position: 'center',
        formatter: () => `{total|${(total / 100000000).toFixed(2)}}\n{unit|亿元}\n{label|总销售额}`,
        rich: {
          total: { fontSize: 28, fontWeight: 'bold', color: '#fff', lineHeight: 36, fontFamily: 'DIN Alternate, monospace' },
          unit: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 20 },
          label: { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 18 }
        }
      },
      emphasis: {
        label: { show: true },
        itemStyle: { shadowBlur: 25, shadowColor: 'rgba(79, 140, 255, 0.6)' },
        scale: true, scaleSize: 8
      },
      labelLine: { show: false },
      data: props.data.map((item, i) => ({
        value: item.value, name: item.name,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: item.color },
            { offset: 1, color: item.color + '66' }
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
