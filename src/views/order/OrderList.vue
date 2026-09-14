<template>
  <div class="page-container">
    <div class="stat-row">
      <div v-for="item in statList" :key="item.label" class="stat-card" :class="item.type">
        <div class="stat-label">{{ item.label }}</div>
        <div class="stat-value">{{ item.value }}</div>
      </div>
    </div>

    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="订单编号">
          <el-input v-model="filterForm.orderNo" placeholder="请输入订单编号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker v-model="filterForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 260px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="orderNo" label="订单编号" width="180" align="center" />
        <el-table-column label="商品信息" min-width="240">
          <template #default="{ row }">
            <div class="order-products">
              <div v-for="(p, i) in row.products.slice(0, 2)" :key="i" class="product-item">
                <div class="product-thumb" :style="{ background: p.bg }">{{ p.name.charAt(0) }}</div>
                <span>{{ p.name }}</span>
              </div>
              <span v-if="row.products.length > 2" class="more-text">等{{ row.products.length }}件</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="buyer" label="买家" width="120" align="center" />
        <el-table-column label="金额" width="120" align="center">
          <template #default="{ row }">
            <span class="amount">¥{{ row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" width="100" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]" size="small">{{ statusTextMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="170" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
            <el-button type="success" link size="small" v-if="row.status === 'pending_ship'" @click="handleShip(row)">发货</el-button>
            <el-button type="warning" link size="small" v-if="row.status === 'pending_pay'" @click="handleRemind(row)">催付</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :page-sizes="[10, 20, 50]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单编号">{{ currentOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="statusTypeMap[currentOrder.status]" size="small">{{ statusTextMap[currentOrder.status] }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="买家">{{ currentOrder.buyer }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentOrder.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ currentOrder.address }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ currentOrder.payMethod }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ currentOrder.payTime }}</el-descriptions-item>
        </el-descriptions>

        <h4 class="detail-title">商品清单</h4>
        <el-table :data="currentOrder.products" border size="small">
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="spec" label="规格" width="120" align="center" />
          <el-table-column prop="price" label="单价" width="100" align="center">
            <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" align="center" />
          <el-table-column label="小计" width="120" align="center">
            <template #default="{ row }">¥{{ (row.price * row.quantity).toFixed(2) }}</template>
          </el-table-column>
        </el-table>

        <div class="order-total">
          <span>订单总额：</span>
          <span class="total-amount">¥{{ currentOrder.amount.toFixed(2) }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface OrderProduct { name: string; spec: string; price: number; quantity: number; bg: string }
interface Order {
  id: number; orderNo: string; products: OrderProduct[]; buyer: string; phone: string; address: string
  amount: number; payMethod: string; status: string; createTime: string; payTime: string
}

const statusOptions = [
  { label: '待付款', value: 'pending_pay' },
  { label: '待发货', value: 'pending_ship' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
  { label: '退款中', value: 'refunding' }
]
const statusTypeMap: Record<string, string> = { pending_pay: 'warning', pending_ship: 'primary', shipped: 'info', completed: 'success', cancelled: 'info', refunding: 'danger' }
const statusTextMap: Record<string, string> = { pending_pay: '待付款', pending_ship: '待发货', shipped: '已发货', completed: '已完成', cancelled: '已取消', refunding: '退款中' }

const loading = ref(false)
const detailVisible = ref(false)
const currentOrder = ref<Order | null>(null)
const allOrders = ref<Order[]>([])

const filterForm = reactive({ orderNo: '', status: '', dateRange: [] as any })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const statList = ref([
  { label: '今日订单', value: '3,256', type: 'primary' },
  { label: '待付款', value: '128', type: 'warning' },
  { label: '待发货', value: '356', type: 'info' },
  { label: '今日成交额', value: '¥86.5万', type: 'success' },
  { label: '退款订单', value: '23', type: 'danger' }
])

const productNames = ['iPhone 15 Pro', '华为 Mate 60', '小米14', 'AirPods Pro', '戴森V15', 'SK-II', 'AJ1', '始祖鸟', '索尼XM5', 'iPad Pro']
const buyerNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
const addresses = ['北京市朝阳区xxx路xxx号', '上海市浦东新区xxx路xxx号', '广州市天河区xxx路xxx号', '深圳市南山区xxx路xxx号', '杭州市西湖区xxx路xxx号']
const payMethods = ['微信支付', '支付宝', '银行卡', '花呗']
const imageBgs = ['linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)', 'linear-gradient(135deg, #4facfe, #00f2fe)', 'linear-gradient(135deg, #43e97b, #38f9d7)']

function generateOrders() {
  const list: Order[] = []
  const now = new Date()
  for (let i = 1; i <= 68; i++) {
    const productCount = Math.floor(Math.random() * 3) + 1
    const products: OrderProduct[] = []
    let amount = 0
    for (let j = 0; j < productCount; j++) {
      const price = Math.floor(Math.random() * 5000 + 99)
      const quantity = Math.floor(Math.random() * 3) + 1
      amount += price * quantity
      products.push({
        name: productNames[Math.floor(Math.random() * productNames.length)],
        spec: ['标准版', 'Pro版', '套装版'][Math.floor(Math.random() * 3)],
        price, quantity,
        bg: imageBgs[Math.floor(Math.random() * imageBgs.length)]
      })
    }
    const createTime = new Date(now.getTime() - Math.floor(Math.random() * 7 * 86400000))
    list.push({
      id: i,
      orderNo: `DD${createTime.getFullYear()}${String(createTime.getMonth() + 1).padStart(2, '0')}${String(createTime.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 900000) + 100000)}`,
      products,
      buyer: buyerNames[Math.floor(Math.random() * buyerNames.length)],
      phone: `138${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      address: addresses[Math.floor(Math.random() * addresses.length)],
      amount,
      payMethod: payMethods[Math.floor(Math.random() * payMethods.length)],
      status: ['completed', 'completed', 'shipped', 'pending_ship', 'pending_pay', 'cancelled', 'refunding'][Math.floor(Math.random() * 7)],
      createTime: `${createTime.getFullYear()}-${String(createTime.getMonth() + 1).padStart(2, '0')}-${String(createTime.getDate()).padStart(2, '0')} ${String(createTime.getHours()).padStart(2, '0')}:${String(createTime.getMinutes()).padStart(2, '0')}:${String(createTime.getSeconds()).padStart(2, '0')}`,
      payTime: `${createTime.getFullYear()}-${String(createTime.getMonth() + 1).padStart(2, '0')}-${String(createTime.getDate()).padStart(2, '0')} ${String(createTime.getHours()).padStart(2, '0')}:${String(createTime.getMinutes() + 5).padStart(2, '0')}:00`
    })
  }
  allOrders.value = list.sort((a, b) => b.createTime.localeCompare(a.createTime))
}

const tableData = computed(() => {
  let filtered = allOrders.value
  if (filterForm.orderNo) filtered = filtered.filter((o) => o.orderNo.includes(filterForm.orderNo))
  if (filterForm.status) filtered = filtered.filter((o) => o.status === filterForm.status)
  pagination.total = filtered.length
  const start = (pagination.page - 1) * pagination.pageSize
  return filtered.slice(start, start + pagination.pageSize)
})

function handleSearch() { pagination.page = 1; loading.value = true; setTimeout(() => (loading.value = false), 300) }
function handleReset() { filterForm.orderNo = ''; filterForm.status = ''; filterForm.dateRange = []; handleSearch() }
function handleDetail(row: Order) { currentOrder.value = row; detailVisible.value = true }
function handleShip(row: Order) { ElMessage.success(`订单 ${row.orderNo} 已发货`) }
function handleRemind(row: Order) { ElMessage.success(`已向买家 ${row.buyer} 发送催付通知`) }

onMounted(() => { generateOrders() })
</script>

<style lang="scss" scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.stat-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
.stat-card { padding: 18px; background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; border-left: 4px solid;
  &.primary { border-left-color: #4f8cff; }
  &.warning { border-left-color: #ffb703; }
  &.info { border-left-color: #00b4d8; }
  &.success { border-left-color: #06d6a0; }
  &.danger { border-left-color: #ef476f; }
}
.stat-label { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
.stat-value { font-size: 24px; font-weight: 700; color: #fff; font-family: 'DIN Alternate', monospace; }
.order-products { display: flex; flex-direction: column; gap: 6px; }
.product-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.8); }
.product-thumb { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 600; flex-shrink: 0; }
.more-text { font-size: 12px; color: rgba(255,255,255,0.4); }
.amount { color: #ef476f; font-weight: 600; }
.pagination { display: flex; justify-content: flex-end; margin-top: 20px; }
.order-detail { .detail-title { color: #fff; margin: 20px 0 12px; font-size: 15px; } }
.order-total { text-align: right; margin-top: 16px; font-size: 15px; color: rgba(255,255,255,0.7); }
.total-amount { font-size: 22px; font-weight: 700; color: #ef476f; }
:deep(.el-card) { background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; }
:deep(.el-card__body) { padding: 20px; }
:deep(.el-table) { --el-table-bg-color: transparent; --el-table-tr-bg-color: transparent; --el-table-header-bg-color: rgba(79,140,255,0.1); --el-table-text-color: rgba(255,255,255,0.8); --el-table-header-text-color: rgba(255,255,255,0.9); --el-table-border-color: rgba(79,140,255,0.15); --el-table-row-hover-bg-color: rgba(79,140,255,0.08); }
:deep(.el-input__wrapper), :deep(.el-select__wrapper) { background: rgba(255,255,255,0.05); box-shadow: 0 0 0 1px rgba(79,140,255,0.2) inset; }
:deep(.el-input__inner), :deep(.el-select__placeholder) { color: rgba(255,255,255,0.9); }
:deep(.el-form-item__label) { color: rgba(255,255,255,0.7); }
:deep(.el-dialog) { background: #0f173a; border: 1px solid rgba(79,140,255,0.2); }
:deep(.el-dialog__title), :deep(.el-descriptions__label), :deep(.el-descriptions__content) { color: rgba(255,255,255,0.9); }
:deep(.el-descriptions) { --el-descriptions-table-border: rgba(79,140,255,0.15); --el-descriptions-item-label-bg-color: rgba(79,140,255,0.08); }
:deep(.el-pagination) { --el-pagination-bg-color: transparent; --el-pagination-text-color: rgba(255,255,255,0.7); --el-pagination-button-color: rgba(255,255,255,0.7); --el-pagination-hover-color: #4f8cff; }
</style>
