export interface KPIData {
  gmv: number
  orders: number
  visitors: number
  conversionRate: number
  avgOrderValue: number
  targetCompletion: number
  gmvGrowth: number
  ordersGrowth: number
  visitorsGrowth: number
  conversionGrowth: number
  avgOrderGrowth: number
  targetGrowth: number
}

export interface ChannelData {
  name: string
  value: number
  color: string
}

export interface FunnelData {
  name: string
  value: number
  rate: number
}

export interface TrendPoint {
  time: string
  value: number
}

export interface ProductItem {
  rank: number
  name: string
  sales: number
  gmv: number
  trend: number
  price: number
}

export interface CategoryData {
  name: string
  value: number
  color: string
}

export interface RegionData {
  name: string
  value: number
}

export interface LogisticsItem {
  orderNo: string
  region: string
  status: string
  time: string
  duration: string
}

export interface PeakData {
  time: string
  sales: number
  gmv: number
}

const TARGET_GMV = 160000000

const channels = [
  { name: '自然搜索', color: '#4f8cff', weight: 0.32 },
  { name: '付费推广', color: '#a855f7', weight: 0.24 },
  { name: '社交媒体', color: '#06d6a0', weight: 0.16 },
  { name: '直播带货', color: '#ef476f', weight: 0.14 },
  { name: '直接访问', color: '#ffb703', weight: 0.09 },
  { name: '小程序', color: '#00b4d8', weight: 0.05 }
]

const categories = [
  { name: '数码电子', color: '#4f8cff', weight: 0.35 },
  { name: '服饰鞋包', color: '#a855f7', weight: 0.24 },
  { name: '美妆个护', color: '#06d6a0', weight: 0.16 },
  { name: '食品生鲜', color: '#ffb703', weight: 0.11 },
  { name: '家居家装', color: '#ef476f', weight: 0.08 },
  { name: '母婴玩具', color: '#00b4d8', weight: 0.06 }
]

const productPool = [
  { name: 'iPhone 15 Pro Max 256G', price: 9999, category: '数码电子' },
  { name: '华为 Mate 60 Pro 512G', price: 6999, category: '数码电子' },
  { name: '小米14 Ultra 摄影套装', price: 6499, category: '数码电子' },
  { name: 'AirPods Pro 2代 降噪耳机', price: 1899, category: '数码电子' },
  { name: '索尼 WH-1000XM5 头戴耳机', price: 2499, category: '数码电子' },
  { name: 'iPad Pro 12.9寸 M2芯片', price: 8599, category: '数码电子' },
  { name: 'MacBook Pro 14寸 M3 Pro', price: 16999, category: '数码电子' },
  { name: '大疆 Mini 4 Pro 无人机', price: 4788, category: '数码电子' },
  { name: '罗技 MX Master 3S 无线鼠标', price: 699, category: '数码电子' },
  { name: '戴森 V15 Detect 无线吸尘器', price: 4990, category: '家居家装' },
  { name: '戴森 Supersonic 吹风机 HD15', price: 2990, category: '美妆个护' },
  { name: 'SK-II 神仙水 230ml 经典版', price: 1590, category: '美妆个护' },
  { name: '雅诗兰黛 小棕瓶精华 50ml', price: 1080, category: '美妆个护' },
  { name: '兰蔻 菁纯面霜 50ml 轻盈版', price: 1680, category: '美妆个护' },
  { name: '海蓝之谜 精华面霜 60ml', price: 2680, category: '美妆个护' },
  { name: 'Nike Air Jordan 1 Retro High OG', price: 1299, category: '服饰鞋包' },
  { name: '始祖鸟 Beta AR 冲锋衣 男款', price: 5980, category: '服饰鞋包' },
  { name: 'Levi\'s 501 原创直筒牛仔裤', price: 699, category: '服饰鞋包' },
  { name: '优衣库 摇粒绒开衫 男女同款', price: 199, category: '服饰鞋包' },
  { name: 'LV Neverfull 中号手袋 M41177', price: 13200, category: '服饰鞋包' },
  { name: '飞利浦 电动牙刷 HX9352/04', price: 1299, category: '美妆个护' },
  { name: 'Kindle Paperwhite 5 电子书', price: 1068, category: '数码电子' },
  { name: 'Switch OLED 任天堂游戏机', price: 2399, category: '数码电子' },
  { name: '三只松鼠 坚果大礼包 1500g', price: 128, category: '食品生鲜' },
  { name: '褚橙 云冠橙 5斤装 特级果', price: 68, category: '食品生鲜' },
  { name: '蒙牛 特仑苏纯牛奶 250ml*16', price: 79, category: '食品生鲜' },
  { name: '全棉时代 婴儿棉柔巾 80抽*6包', price: 108, category: '母婴玩具' },
  { name: '乐高 城市系列 消防救援队 60321', price: 499, category: '母婴玩具' },
  { name: '小米 米家扫地机器人 Pro', price: 2499, category: '家居家装' },
  { name: '美的 变频空调 1.5匹 新一级', price: 2699, category: '家居家装' }
]

const provinceWeights: Record<string, number> = {
  '广东': 1.0, '江苏': 0.85, '浙江': 0.82, '山东': 0.68, '河南': 0.62,
  '四川': 0.58, '湖北': 0.52, '湖南': 0.50, '河北': 0.48, '福建': 0.46,
  '安徽': 0.42, '北京': 0.40, '上海': 0.38, '辽宁': 0.35, '陕西': 0.33,
  '江西': 0.32, '重庆': 0.30, '广西': 0.28, '云南': 0.26, '山西': 0.25,
  '贵州': 0.22, '黑龙江': 0.21, '吉林': 0.18, '甘肃': 0.15, '内蒙古': 0.14,
  '新疆': 0.12, '海南': 0.10, '宁夏': 0.07, '青海': 0.05, '西藏': 0.03, '天津': 0.28
}

const logisticsStatusWeights: Record<string, number> = {
  '已签收': 0.45, '运输中': 0.25, '派送中': 0.15, '已发货': 0.10, '待揽收': 0.05
}

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max + 1))
}

function weightedPick<T extends { weight: number }>(arr: T[]): T {
  const total = arr.reduce((sum, item) => sum + item.weight, 0)
  let r = Math.random() * total
  for (const item of arr) {
    r -= item.weight
    if (r <= 0) return item
  }
  return arr[arr.length - 1]
}

function weightedPickFromMap(map: Record<string, number>): string {
  const arr = Object.entries(map).map(([name, weight]) => ({ name, weight }))
  return weightedPick(arr).name
}

export function generateKPI(): KPIData {
  const visitors = randomInt(4800000, 5600000)
  const conversionRate = random(0.155, 0.175)
  const orders = Math.floor(visitors * conversionRate)
  const avgOrderValue = random(145, 165)
  const gmv = Math.floor(orders * avgOrderValue)
  const targetCompletion = gmv / TARGET_GMV

  return {
    gmv,
    orders,
    visitors,
    conversionRate,
    avgOrderValue,
    targetCompletion,
    gmvGrowth: random(0.18, 0.28),
    ordersGrowth: random(0.15, 0.22),
    visitorsGrowth: random(0.25, 0.38),
    conversionGrowth: random(0.03, 0.08),
    avgOrderGrowth: random(0.02, 0.06),
    targetGrowth: random(0.10, 0.16)
  }
}

export function generateChannels(): ChannelData[] {
  const total = randomInt(4500000, 5500000)
  return channels.map((ch) => ({
    name: ch.name,
    color: ch.color,
    value: Math.floor(total * ch.weight * random(0.9, 1.1))
  }))
}

export function generateFunnel(): FunnelData[] {
  const visitors = randomInt(4800000, 5600000)
  const detailRate = random(0.58, 0.65)
  const cartRate = random(0.22, 0.28)
  const orderRate = random(0.14, 0.18)
  const payRate = random(0.12, 0.16)

  const detail = Math.floor(visitors * detailRate)
  const cart = Math.floor(visitors * cartRate)
  const order = Math.floor(visitors * orderRate)
  const pay = Math.floor(visitors * payRate)

  return [
    { name: '访问首页', value: visitors, rate: 1 },
    { name: '浏览详情', value: detail, rate: detail / visitors },
    { name: '加入购物车', value: cart, rate: cart / visitors },
    { name: '提交订单', value: order, rate: order / visitors },
    { name: '完成支付', value: pay, rate: pay / visitors }
  ]
}

export function generateVisitorTrend(): TrendPoint[] {
  const data: TrendPoint[] = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    const hour = time.getHours()
    let base: number

    if (hour >= 0 && hour < 6) base = random(15000, 35000)
    else if (hour >= 6 && hour < 9) base = random(40000, 80000)
    else if (hour >= 9 && hour < 12) base = random(100000, 150000)
    else if (hour >= 12 && hour < 14) base = random(130000, 170000)
    else if (hour >= 14 && hour < 18) base = random(90000, 130000)
    else if (hour >= 18 && hour < 20) base = random(140000, 190000)
    else if (hour >= 20 && hour < 23) base = random(180000, 240000)
    else base = random(100000, 150000)

    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      value: Math.floor(base)
    })
  }

  return data
}

export function generateProductRank(): ProductItem[] {
  const shuffled = [...productPool].sort(() => Math.random() - 0.5).slice(0, 10)
  const sorted = shuffled.sort((a, b) => b.price * random(0.8, 1.2) - a.price * random(0.8, 1.2))

  return sorted.map((product, index) => {
    const sales = Math.floor(random(3000, 30000) * (1 - index * 0.08))
    const gmv = Math.floor(sales * product.price * random(0.95, 1.05))
    return {
      rank: index + 1,
      name: product.name,
      sales,
      gmv,
      price: product.price,
      trend: random(-0.12, 0.35)
    }
  })
}

export function generateCategory(): CategoryData[] {
  const total = randomInt(120000000, 150000000)
  return categories.map((cat) => ({
    name: cat.name,
    color: cat.color,
    value: Math.floor(total * cat.weight * random(0.92, 1.08))
  }))
}

export function generateRegion(): RegionData[] {
  const base = randomInt(150000, 200000)
  return Object.entries(provinceWeights).map(([name, weight]) => ({
    name,
    value: Math.floor(base * weight * random(0.85, 1.15))
  }))
}

export function generateLogistics(count = 20): LogisticsItem[] {
  const list: LogisticsItem[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const orderTime = new Date(now.getTime() - randomInt(0, 5 * 86400000))
    const region = weightedPickFromMap(provinceWeights)
    const status = weightedPickFromMap(logisticsStatusWeights)

    let durationHours: number
    if (region === '广东' || region === '江苏' || region === '浙江' || region === '上海' || region === '北京') {
      durationHours = random(6, 36)
    } else if (region === '新疆' || region === '西藏' || region === '青海' || region === '内蒙古') {
      durationHours = random(48, 120)
    } else {
      durationHours = random(24, 72)
    }

    const hours = Math.floor(durationHours)
    const minutes = Math.floor((durationHours - hours) * 60)

    list.push({
      orderNo: `DD${orderTime.getFullYear()}${(orderTime.getMonth() + 1).toString().padStart(2, '0')}${orderTime.getDate().toString().padStart(2, '0')}${randomInt(100000, 999999)}`,
      region,
      status,
      time: `${orderTime.getHours().toString().padStart(2, '0')}:${orderTime.getMinutes().toString().padStart(2, '0')}:${orderTime.getSeconds().toString().padStart(2, '0')}`,
      duration: `${hours}小时${minutes}分`
    })
  }

  return list.sort((a, b) => b.time.localeCompare(a.time))
}

export function generatePeak(): PeakData {
  const now = new Date()
  const sales = randomInt(8000, 18000)
  const avgPrice = random(180, 280)
  return {
    time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
    sales,
    gmv: Math.floor(sales * avgPrice)
  }
}

export function generateSalesTrend(): { date: string; gmv: number; orders: number }[] {
  const data = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseMultiplier = isWeekend ? 1.2 : 1.0

    const orders = Math.floor(randomInt(600000, 900000) * baseMultiplier)
    const avgOrderValue = random(145, 165)
    const gmv = Math.floor(orders * avgOrderValue)

    data.push({
      date: `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`,
      gmv,
      orders
    })
  }

  return data
}
