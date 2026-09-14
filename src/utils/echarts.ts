import * as echarts from 'echarts'

export const themeColors = [
  '#4f8cff', '#a855f7', '#06d6a0', '#ffb703',
  '#ef476f', '#00b4d8', '#ff6b6b', '#4ecdc4'
]

export function registerScreenTheme() {
  echarts.registerTheme('screen', {
    color: themeColors,
    backgroundColor: 'transparent',
    textStyle: {
      fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    title: {
      textStyle: { color: '#ffffff', fontSize: 18 },
      subtextStyle: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 14 }
    },
    legend: {
      textStyle: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 },
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 20
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 58, 0.95)',
      borderColor: 'rgba(79, 140, 255, 0.5)',
      borderWidth: 1,
      textStyle: { color: '#ffffff', fontSize: 14 },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    categoryAxis: {
      axisLine: { lineStyle: { color: 'rgba(79, 140, 255, 0.3)' } },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 12 },
      splitLine: { show: false }
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 12 },
      splitLine: { lineStyle: { color: 'rgba(79, 140, 255, 0.1)', type: 'dashed' } }
    },
    line: {
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 3 },
      itemStyle: { borderWidth: 2, borderColor: '#fff' }
    },
    bar: { itemStyle: { borderRadius: [4, 4, 0, 0] } },
    pie: { itemStyle: { borderColor: 'rgba(15, 23, 58, 0.8)', borderWidth: 2 } }
  })
}

export function createLinearGradient(color1: string, color2: string) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: color1 },
    { offset: 1, color: color2 }
  ])
}

export function createRadialGradient(color1: string, color2: string) {
  return new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
    { offset: 0, color: color1 },
    { offset: 1, color: color2 }
  ])
}

export default echarts
