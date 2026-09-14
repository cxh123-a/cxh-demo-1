<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

interface SalesTrendItem { date: string; gmv: number; orders: number }
interface Props { data: SalesTrendItem[] }
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
      axisPointer: { type: 'cross', crossStyle: { color: 'rgba(79, 140, 255, 0.5)' } },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((item: any) => {
          const value = item.seriesName === 'GMV' ? `¥${(item.value / 100000000).toFixed(2)}亿` : item.value.toLocaleString()
          result += `${item.marker} ${item.seriesName}: ${value}<br/>`
        })
        return result
      }
    },
    legend: { data: ['GMV', '订单量'], top: 0, right: 0, textStyle: { color: 'rgba(255,255,255,0.7)', fontSize: 13 }, itemWidth: 16, itemHeight: 10 },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category', boundaryGap: false,
      data: props.data.map((item) => item.date),
      axisLine: { lineStyle: { color: 'rgba(79, 140, 255, 0.3)' } },
      axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value', name: 'GMV(亿)',
        nameTextStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, formatter: (value: number) => (value / 100000000).toFixed(1) },
        splitLine: { lineStyle: { color: 'rgba(79, 140, 255, 0.1)', type: 'dashed' } }
      },
      {
        type: 'value', name: '订单量',
        nameTextStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.6)', fontSize: 11,
          formatter: (value: number) => value >= 10000 ? (value / 10000).toFixed(0) + 'w' : value.toString()
        },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'GMV', type: 'line', smooth: true,
        symbol: 'circle', symbolSize: 8,
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#4f8cff' }, { offset: 1, color: '#a855f7' }]),
          shadowColor: 'rgba(79, 140, 255, 0.5)', shadowBlur: 10
        },
        itemStyle: { color: '#fff', borderColor: '#4f8cff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(79, 140, 255, 0.35)' },
            { offset: 1, color: 'rgba(79, 140, 255, 0.02)' }
          ])
        },
        emphasis: { scale: 1.5, itemStyle: { shadowBlur: 15, shadowColor: 'rgba(79, 140, 255, 0.8)' } },
        data: props.data.map((item) => item.gmv)
      },
      {
        name: '订单量', type: 'bar', yAxisIndex: 1,
        barWidth: 20,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(6, 214, 160, 0.8)' },
            { offset: 1, color: 'rgba(6, 214, 160, 0.2)' }
          ])
        },
        emphasis: { itemStyle: { shadowBlur: 15, shadowColor: 'rgba(6, 214, 160, 0.6)' } },
        data: props.data.map((item) => item.orders)
      }
    ]
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
