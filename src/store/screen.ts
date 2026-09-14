import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  kpiData, channelData, funnelData, visitorTrendData, productRankData,
  categoryData, regionData, logisticsData, peakData, salesTrendData,
  startAllRefresh, stopAllRefresh, refreshData
} from '@/mock/refresh'
import type {
  KPIData, ChannelData, FunnelData, TrendPoint, ProductItem,
  CategoryData, RegionData, LogisticsItem, PeakData
} from '@/mock/data'

export const useScreenStore = defineStore('screen', () => {
  const isLoading = ref(true)
  const currentTime = ref(new Date())
  const isPaused = ref(false)

  const kpi = ref<KPIData>(kpiData.value)
  const channels = ref<ChannelData[]>(channelData.value)
  const funnel = ref<FunnelData[]>(funnelData.value)
  const visitorTrend = ref<TrendPoint[]>(visitorTrendData.value)
  const productRank = ref<ProductItem[]>(productRankData.value)
  const category = ref<CategoryData[]>(categoryData.value)
  const region = ref<RegionData[]>(regionData.value)
  const logistics = ref<LogisticsItem[]>(logisticsData.value)
  const peak = ref<PeakData>(peakData.value)
  const salesTrend = ref<{ date: string; gmv: number; orders: number }[]>(salesTrendData.value)

  const formattedGMV = computed(() => {
    const value = kpi.value.gmv
    if (value >= 100000000) return (value / 100000000).toFixed(2)
    if (value >= 10000) return (value / 10000).toFixed(0)
    return value.toString()
  })

  const gmvUnit = computed(() => {
    const value = kpi.value.gmv
    if (value >= 100000000) return '亿'
    if (value >= 10000) return '万'
    return '元'
  })

  const totalChannelValue = computed(() => channels.value.reduce((sum, item) => sum + item.value, 0))
  const totalCategoryValue = computed(() => category.value.reduce((sum, item) => sum + item.value, 0))

  function init() {
    isLoading.value = true
    startAllRefresh()

    const syncData = () => {
      kpi.value = { ...kpiData.value }
      channels.value = [...channelData.value]
      funnel.value = [...funnelData.value]
      visitorTrend.value = [...visitorTrendData.value]
      productRank.value = [...productRankData.value]
      category.value = [...categoryData.value]
      region.value = [...regionData.value]
      logistics.value = [...logisticsData.value]
      peak.value = { ...peakData.value }
      salesTrend.value = [...salesTrendData.value]
    }

    syncData()
    const watcher = setInterval(() => {
      if (!isPaused.value) syncData()
    }, 500)

    setTimeout(() => { isLoading.value = false }, 1000)

    return () => {
      clearInterval(watcher)
      stopAllRefresh()
    }
  }

  function togglePause() {
    isPaused.value = !isPaused.value
  }

  function refresh(module: string) {
    refreshData(module)
  }

  function updateTime() {
    currentTime.value = new Date()
  }

  return {
    isLoading, currentTime, isPaused,
    kpi, channels, funnel, visitorTrend, productRank, category, region, logistics, peak, salesTrend,
    formattedGMV, gmvUnit, totalChannelValue, totalCategoryValue,
    init, togglePause, refresh, updateTime
  }
})
