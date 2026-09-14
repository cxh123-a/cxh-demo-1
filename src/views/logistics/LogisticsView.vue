<template>
  <div class="page-container">
    <div class="kpi-row">
      <div v-for="item in kpiList" :key="item.label" class="kpi-card">
        <div class="kpi-icon" :style="{ background: item.bg }"><el-icon :size="22"><component :is="item.icon" /></el-icon></div>
        <div class="kpi-info"><div class="kpi-label">{{ item.label }}</div><div class="kpi-value">{{ item.value }}</div></div>
      </div>
    </div>

    <div class="chart-row">
      <el-card class="chart-card" shadow="never">
        <template #header><span class="card-title">物流时效分布</span></template>
        <div ref="timeRef" class="chart-box"></div>
      </el-card>
      <el-card class="chart-card" shadow="never">
        <template #header><span class="card-title">配送方式占比</span></template>
        <div ref="methodRef" class="chart-box"></div>
      </el-card>
    </div>

    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">物流订单列表</span>
          <div>
            <el-select v-model="statusFilter" placeholder="全部状态" clearable size="small" style="width: 140px; margin-right: 10px">
              <el-option label="待揽收" value="pending" /><el-option label="已发货" value="shipped" /><el-option label="运输中" value="transporting" /><el-option label="派送中" value="delivering" /><el-option label="已签收" value="signed" />
            </el-select>
            <el-button type="primary" size="small" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>
      <el-table :data="filteredList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="orderNo" label="订单编号" width="180" align="center" />
        <el-table-column prop="receiver" label="收货人" width="100" align="center" />
        <el-table-column prop="region" label="目的地" width="120" align="center" />
        <el-table-column prop="method" label="配送方式" width="100" align="center" />
        <el-table-column prop="duration" label="物流时长" width="120" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }"><el-tag :type="statusTypeMap[row.status]" size="small">{{ statusTextMap[row.status] }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170" align="center" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }"><el-button type="primary" link size="small" @click="handleTrack(row)">轨迹</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="trackVisible" title="物流轨迹" width="500px">
      <el-timeline>
        <el-timeline-item v-for="(node, i) in trackNodes" :key="i" :timestamp="node.time" :type="i === 0 ? 'primary' : ''" :hollow="i === 0">
          {{ node.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { registerScreenTheme } from '@/utils/echarts'
import { ElMessage } from 'element-plus'
import { Van, Clock, Check, Warning } from '@element-plus/icons-vue'

const timeRef = ref<HTMLElement>(); const methodRef = ref<HTMLElement>()
let charts: echarts.ECharts[] = []
const statusFilter = ref('')
const trackVisible = ref(false)
const trackNodes = ref<any[]>([])

const statusTypeMap: Record<string, string> = { pending: 'info', shipped: 'primary', transporting: 'warning', delivering: 'info', signed: 'success' }
const statusTextMap: Record<string, string> = { pending: '待揽收', shipped: '已发货', transporting: '运输中', delivering: '派送中', signed: '已签收' }

const kpiList = ref([
  { label: '今日发货', value: '2,856', icon: Van, bg: 'linear-gradient(135deg, #4f8cff, #a855f7)' },
  { label: '平均时效', value: '36.5h', icon: Clock, bg: 'linear-gradient(135deg, #06d6a0, #00b4d8)' },
  { label: '已签收', value: '2,180', icon: Check, bg: 'linear-gradient(135deg, #ffb703, #fb8500)' },
  { label: '异常件', value: '23', icon: Warning, bg: 'linear-gradient(135deg, #ef476f, #ff6b6b)' }
])

const logisticsList = ref<any[]>([])
const receivers = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
const regions = ['广东广州', '江苏南京', '浙江杭州', '山东济南', '河南郑州', '四川成都', '湖北武汉', '湖南长沙', '河北石家庄', '福建福州']
const methods = ['顺丰速运', '京东物流', '中通快递', '圆通速递', '韵达快递', 'EMS']
const statuses = ['signed', 'signed', 'signed', 'delivering', 'transporting', 'shipped', 'pending']

function generateList() {
  const list = []
  const now = new Date()
  for (let i = 1; i <= 50; i++) {
    const t = new Date(now.getTime() - Math.floor(Math.random() * 5 * 86400000))
    list.push({
      id: i,
      orderNo: `DD${t.getFullYear()}${String(t.getMonth()+1).padStart(2,'0')}${String(t.getDate()).padStart(2,'0')}${String(Math.floor(Math.random()*900000)+100000)}`,
      receiver: receivers[Math.floor(Math.random()*receivers.length)],
      region: regions[Math.floor(Math.random()*regions.length)],
      method: methods[Math.floor(Math.random()*methods.length)],
      duration: `${Math.floor(Math.random()*72)+1}小时${Math.floor(Math.random()*59)}分`,
      status: statuses[Math.floor(Math.random()*statuses.length)],
      updateTime: `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')} ${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`
    })
  }
  logisticsList.value = list.sort((a,b) => b.updateTime.localeCompare(a.updateTime))
}

const filteredList = computed(() => statusFilter.value ? logisticsList.value.filter((l) => l.status === statusFilter.value) : logisticsList.value)

function handleTrack(row: any) {
  trackNodes.value = [
    { time: row.updateTime, content: `${row.status === 'signed' ? '已签收' : '物流更新中'} - ${row.region}` },
    { time: row.updateTime.substring(0, 10) + ' 12:00:00', content: '到达目的地分拨中心' },
    { time: row.updateTime.substring(0, 10) + ' 08:30:00', content: '离开始发地分拨中心' },
    { time: row.updateTime.substring(0, 10) + ' 06:00:00', content: '商家已发货' },
    { time: row.updateTime.substring(0, 10) + ' 04:00:00', content: '订单已创建' }
  ]
  trackVisible.value = true
}

function handleExport() { ElMessage.success('导出成功') }

function initCharts() {
  registerScreenTheme()
  const t = echarts.init(timeRef.value!, 'screen')
  t.setOption({ tooltip: { trigger: 'axis' }, grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }, xAxis: { type: 'category', data: ['12h内', '12-24h', '24-48h', '48-72h', '72h以上'] }, yAxis: { type: 'value', name: '订单量' }, series: [{ type: 'bar', data: [856, 1200, 580, 180, 40], barWidth: '50%', itemStyle: { borderRadius: [6,6,0,0], color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#4f8cff'},{offset:1,color:'#a855f7'}]) } }] })
  charts.push(t)

  const m = echarts.init(methodRef.value!, 'screen')
  m.setOption({ tooltip: { trigger: 'item' }, legend: { bottom: '5%', textStyle: { color: 'rgba(255,255,255,0.7)' } }, series: [{ type: 'pie', radius: ['40%','65%'], center: ['50%','45%'], label: { formatter: '{b}\n{d}%', color: 'rgba(255,255,255,0.8)', fontSize: 12 }, data: [{ name: '顺丰速运', value: 35, itemStyle: { color: '#4f8cff' } }, { name: '京东物流', value: 28, itemStyle: { color: '#a855f7' } }, { name: '中通快递', value: 18, itemStyle: { color: '#06d6a0' } }, { name: '圆通速递', value: 12, itemStyle: { color: '#ffb703' } }, { name: '其他', value: 7, itemStyle: { color: '#ef476f' } }] }] })
  charts.push(m)
}

function handleResize() { charts.forEach((c) => c.resize()) }

onMounted(() => { generateList(); initCharts(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); charts.forEach((c) => c.dispose()) })
</script>

<style lang="scss" scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.kpi-card { display: flex; align-items: center; gap: 14px; padding: 18px; background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; }
.kpi-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.kpi-label { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
.kpi-value { font-size: 24px; font-weight: 700; color: #fff; font-family: 'DIN Alternate', monospace; }
.chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.chart-box { height: 280px; width: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9); }
:deep(.el-card) { background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; }
:deep(.el-card__header) { padding: 14px 20px; border-bottom: 1px solid rgba(79,140,255,0.1); }
:deep(.el-table) { --el-table-bg-color: transparent; --el-table-tr-bg-color: transparent; --el-table-header-bg-color: rgba(79,140,255,0.1); --el-table-text-color: rgba(255,255,255,0.8); --el-table-header-text-color: rgba(255,255,255,0.9); --el-table-border-color: rgba(79,140,255,0.15); --el-table-row-hover-bg-color: rgba(79,140,255,0.08); }
:deep(.el-select__wrapper), :deep(.el-input__wrapper) { background: rgba(255,255,255,0.05); box-shadow: 0 0 0 1px rgba(79,140,255,0.2) inset; }
:deep(.el-dialog) { background: #0f173a; border: 1px solid rgba(79,140,255,0.2); }
:deep(.el-dialog__title), :deep(.el-timeline-item__content), :deep(.el-timeline-item__timestamp) { color: rgba(255,255,255,0.9); }
</style>
