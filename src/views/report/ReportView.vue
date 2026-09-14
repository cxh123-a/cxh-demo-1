<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="报表类型">
          <el-select v-model="filterForm.type" style="width: 140px">
            <el-option label="销售报表" value="sales" /><el-option label="流量报表" value="traffic" /><el-option label="商品报表" value="product" /><el-option label="物流报表" value="logistics" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker v-model="filterForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 260px" />
        </el-form-item>
        <el-form-item label="时间维度">
          <el-radio-group v-model="filterForm.dimension">
            <el-radio-button value="day">按日</el-radio-button>
            <el-radio-button value="week">按周</el-radio-button>
            <el-radio-button value="month">按月</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleGenerate">生成报表</el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="summary-row">
      <div v-for="item in summaryList" :key="item.label" class="summary-card">
        <div class="summary-label">{{ item.label }}</div>
        <div class="summary-value">{{ item.value }}</div>
        <div class="summary-compare">
          <span :class="item.trend > 0 ? 'up' : 'down'">{{ item.trend > 0 ? '↑' : '↓' }} {{ Math.abs(item.trend) }}%</span>
          <span class="compare-label">环比上期</span>
        </div>
      </div>
    </div>

    <el-card class="chart-card" shadow="never">
      <template #header><span class="card-title">数据趋势图</span></template>
      <div ref="chartRef" class="chart-box"></div>
    </el-card>

    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">报表明细数据</span>
          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
        </div>
      </template>
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="date" label="日期" width="140" align="center" />
        <el-table-column prop="orders" label="订单量" width="120" align="center">
          <template #default="{ row }">{{ row.orders.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="gmv" label="GMV(元)" width="160" align="center">
          <template #default="{ row }">¥{{ row.gmv.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="visitors" label="访客数" width="120" align="center">
          <template #default="{ row }">{{ row.visitors.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="conversion" label="转化率" width="100" align="center">
          <template #default="{ row }">{{ (row.conversion * 100).toFixed(2) }}%</template>
        </el-table-column>
        <el-table-column prop="avgOrder" label="客单价(元)" width="120" align="center">
          <template #default="{ row }">¥{{ row.avgOrder.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="refundRate" label="退款率" width="100" align="center">
          <template #default="{ row }">{{ (row.refundRate * 100).toFixed(2) }}%</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :page-sizes="[10, 20, 50]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { registerScreenTheme } from '@/utils/echarts'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const filterForm = reactive({ type: 'sales', dateRange: [], dimension: 'day' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const summaryList = ref([
  { label: '总订单量', value: '45,286', trend: 12.5 },
  { label: '总GMV', value: '¥1,286.5万', trend: 8.3 },
  { label: '总访客数', value: '856,320', trend: 15.2 },
  { label: '平均转化率', value: '5.29%', trend: -0.8 },
  { label: '平均客单价', value: '¥284.12', trend: 3.2 },
  { label: '总退款率', value: '2.15%', trend: -0.5 }
])

const allData = ref<any[]>([])

function generateData() {
  const list = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000)
    const orders = Math.floor(Math.random() * 2000 + 1000)
    const gmv = orders * (Math.random() * 100 + 200)
    list.push({
      date: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
      orders, gmv: Math.floor(gmv),
      visitors: Math.floor(orders / (0.03 + Math.random() * 0.04)),
      conversion: 0.03 + Math.random() * 0.04,
      avgOrder: gmv / orders,
      refundRate: 0.01 + Math.random() * 0.03
    })
  }
  allData.value = list
}

const tableData = computed(() => {
  pagination.total = allData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return allData.value.slice(start, start + pagination.pageSize)
})

function initChart() {
  registerScreenTheme()
  chart = echarts.init(chartRef.value!, 'screen')
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['GMV', '订单量', '访客数'], textStyle: { color: 'rgba(255,255,255,0.7)' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: allData.value.map((d) => d.date.substring(5)) },
    yAxis: [
      { type: 'value', name: 'GMV(万)' },
      { type: 'value', name: '数量' }
    ],
    series: [
      { name: 'GMV', type: 'line', smooth: true, data: allData.value.map((d) => Math.floor(d.gmv / 10000)), areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(79,140,255,0.4)'},{offset:1,color:'rgba(79,140,255,0.02)'}]) } },
      { name: '订单量', type: 'bar', yAxisIndex: 1, data: allData.value.map((d) => d.orders), itemStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(6,214,160,0.8)'},{offset:1,color:'rgba(6,214,160,0.2)'}]) } },
      { name: '访客数', type: 'line', yAxisIndex: 1, smooth: true, data: allData.value.map((d) => d.visitors) }
    ]
  })
}

function handleGenerate() { ElMessage.success('报表已生成') }
function handleExport() { ElMessage.success('导出成功，文件已开始下载') }

function handleResize() { chart?.resize() }

onMounted(() => { generateData(); initChart(); window.addEventListener('resize', handleResize) })
onUnmounted(() => { window.removeEventListener('resize', handleResize); chart?.dispose() })
</script>

<style lang="scss" scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.summary-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.summary-card { padding: 16px; background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; }
.summary-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
.summary-value { font-size: 20px; font-weight: 700; color: #fff; font-family: 'DIN Alternate', monospace; margin-bottom: 4px; }
.summary-compare { display: flex; align-items: center; gap: 6px; font-size: 12px; .up { color: #06d6a0; } .down { color: #ef476f; } .compare-label { color: rgba(255,255,255,0.4); } }
.chart-box { height: 320px; width: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9); }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }
:deep(.el-card) { background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; }
:deep(.el-card__header) { padding: 14px 20px; border-bottom: 1px solid rgba(79,140,255,0.1); }
:deep(.el-card__body) { padding: 20px; }
:deep(.el-table) { --el-table-bg-color: transparent; --el-table-tr-bg-color: transparent; --el-table-header-bg-color: rgba(79,140,255,0.1); --el-table-text-color: rgba(255,255,255,0.8); --el-table-header-text-color: rgba(255,255,255,0.9); --el-table-border-color: rgba(79,140,255,0.15); --el-table-row-hover-bg-color: rgba(79,140,255,0.08); }
:deep(.el-input__wrapper), :deep(.el-select__wrapper) { background: rgba(255,255,255,0.05); box-shadow: 0 0 0 1px rgba(79,140,255,0.2) inset; }
:deep(.el-input__inner), :deep(.el-select__placeholder) { color: rgba(255,255,255,0.9); }
:deep(.el-form-item__label) { color: rgba(255,255,255,0.7); }
:deep(.el-radio-button__inner) { background: rgba(255,255,255,0.05); border-color: rgba(79,140,255,0.2); color: rgba(255,255,255,0.7); }
:deep(.el-radio-button.is-active .el-radio-button__inner) { background: #4f8cff; border-color: #4f8cff; color: #fff; }
:deep(.el-pagination) { --el-pagination-bg-color: transparent; --el-pagination-text-color: rgba(255,255,255,0.7); --el-pagination-button-color: rgba(255,255,255,0.7); --el-pagination-hover-color: #4f8cff; }
</style>
