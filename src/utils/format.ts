export function formatMoney(value: number, decimals = 2): string {
  if (value >= 100000000) return (value / 100000000).toFixed(decimals) + ' 亿'
  if (value >= 10000) return (value / 10000).toFixed(decimals) + ' 万'
  return value.toFixed(decimals)
}

export function formatNumber(value: number): string {
  return value.toLocaleString('zh-CN')
}

export function formatPercent(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + '%'
}

export function formatGrowth(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return sign + (value * 100).toFixed(2) + '%'
}

export function formatTime(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function formatDate(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function formatDateTime(date: Date = new Date()): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

export function padZero(num: number, len = 2): string {
  return num.toString().padStart(len, '0')
}
