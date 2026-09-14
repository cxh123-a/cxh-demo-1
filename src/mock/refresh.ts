import { ref, type Ref } from 'vue'
import {
  generateKPI, generateChannels, generateFunnel, generateVisitorTrend,
  generateProductRank, generateCategory, generateRegion, generateLogistics,
  generatePeak, generateSalesTrend,
  type KPIData, type ChannelData, type FunnelData, type TrendPoint,
  type ProductItem, type CategoryData, type RegionData, type LogisticsItem, type PeakData
} from './data'

const REFRESH_INTERVALS = {
  kpi: 3000, channels: 5000, funnel: 5000, visitorTrend: 5000,
  productRank: 8000, category: 10000, region: 10000, logistics: 3000,
  peak: 2000, salesTrend: 15000
}

const timers: Map<string, ReturnType<typeof setInterval>> = new Map()
const lastUpdate: Map<string, number> = new Map()

export const kpiData: Ref<KPIData> = ref(generateKPI())
export const channelData: Ref<ChannelData[]> = ref(generateChannels())
export const funnelData: Ref<FunnelData[]> = ref(generateFunnel())
export const visitorTrendData: Ref<TrendPoint[]> = ref(generateVisitorTrend())
export const productRankData: Ref<ProductItem[]> = ref(generateProductRank())
export const categoryData: Ref<CategoryData[]> = ref(generateCategory())
export const regionData: Ref<RegionData[]> = ref(generateRegion())
export const logisticsData: Ref<LogisticsItem[]> = ref(generateLogistics())
export const peakData: Ref<PeakData> = ref(generatePeak())
export const salesTrendData: Ref<{ date: string; gmv: number; orders: number }[]> = ref(generateSalesTrend())

function throttledUpdate(key: string, updateFn: () => void, interval: number): void {
  const now = Date.now()
  const last = lastUpdate.get(key) || 0
  if (now - last >= interval) {
    updateFn()
    lastUpdate.set(key, now)
  }
}

export function startAllRefresh(): void {
  timers.set('kpi', setInterval(() => throttledUpdate('kpi', () => { kpiData.value = generateKPI() }, REFRESH_INTERVALS.kpi), 1000))
  timers.set('channels', setInterval(() => throttledUpdate('channels', () => { channelData.value = generateChannels() }, REFRESH_INTERVALS.channels), 1000))
  timers.set('funnel', setInterval(() => throttledUpdate('funnel', () => { funnelData.value = generateFunnel() }, REFRESH_INTERVALS.funnel), 1000))
  timers.set('visitorTrend', setInterval(() => throttledUpdate('visitorTrend', () => { visitorTrendData.value = generateVisitorTrend() }, REFRESH_INTERVALS.visitorTrend), 1000))
  timers.set('productRank', setInterval(() => throttledUpdate('productRank', () => { productRankData.value = generateProductRank() }, REFRESH_INTERVALS.productRank), 1000))
  timers.set('category', setInterval(() => throttledUpdate('category', () => { categoryData.value = generateCategory() }, REFRESH_INTERVALS.category), 1000))
  timers.set('region', setInterval(() => throttledUpdate('region', () => { regionData.value = generateRegion() }, REFRESH_INTERVALS.region), 1000))
  timers.set('logistics', setInterval(() => throttledUpdate('logistics', () => { logisticsData.value = generateLogistics() }, REFRESH_INTERVALS.logistics), 1000))
  timers.set('peak', setInterval(() => throttledUpdate('peak', () => { peakData.value = generatePeak() }, REFRESH_INTERVALS.peak), 1000))
  timers.set('salesTrend', setInterval(() => throttledUpdate('salesTrend', () => { salesTrendData.value = generateSalesTrend() }, REFRESH_INTERVALS.salesTrend), 1000))
}

export function stopAllRefresh(): void {
  timers.forEach((timer) => clearInterval(timer))
  timers.clear()
  lastUpdate.clear()
}

export function refreshData(key: string): void {
  const updateMap: Record<string, () => void> = {
    kpi: () => { kpiData.value = generateKPI() },
    channels: () => { channelData.value = generateChannels() },
    funnel: () => { funnelData.value = generateFunnel() },
    visitorTrend: () => { visitorTrendData.value = generateVisitorTrend() },
    productRank: () => { productRankData.value = generateProductRank() },
    category: () => { categoryData.value = generateCategory() },
    region: () => { regionData.value = generateRegion() },
    logistics: () => { logisticsData.value = generateLogistics() },
    peak: () => { peakData.value = generatePeak() },
    salesTrend: () => { salesTrendData.value = generateSalesTrend() }
  }
  if (updateMap[key]) {
    updateMap[key]()
    lastUpdate.set(key, Date.now())
  }
}
