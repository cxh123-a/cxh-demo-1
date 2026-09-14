<template>
  <div class="page-container">
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="商品名称">
          <el-input v-model="filterForm.name" placeholder="请输入商品名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="filterForm.category" placeholder="全部分类" clearable style="width: 160px">
            <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="已上架" value="online" />
            <el-option label="已下架" value="offline" />
            <el-option label="待审核" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="action-bar">
      <div class="action-left">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增商品
        </el-button>
        <el-button type="success" :disabled="selectedRows.length === 0" @click="handleBatchOnline">
          批量上架
        </el-button>
        <el-button type="warning" :disabled="selectedRows.length === 0" @click="handleBatchOffline">
          批量下架
        </el-button>
        <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>
      <div class="action-right">
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>导出
        </el-button>
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="loading"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="商品信息" min-width="280">
          <template #default="{ row }">
            <div class="product-info">
              <div class="product-image" :style="{ background: row.imageBg }">
                <span>{{ row.name.charAt(0) }}</span>
              </div>
              <div class="product-detail">
                <div class="product-name">{{ row.name }}</div>
                <div class="product-sku">SKU: {{ row.sku }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" align="center" />
        <el-table-column label="价格" width="120" align="center">
          <template #default="{ row }">
            <span class="price">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" align="center" />
        <el-table-column prop="sales" label="销量" width="100" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTypeMap[row.status]" size="small">{{ statusTextMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link size="small" v-if="row.status === 'offline'" @click="handleOnline(row)">上架</el-button>
            <el-button type="warning" link size="small" v-if="row.status === 'online'" @click="handleOffline(row)">下架</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" destroy-on-close>
      <el-form :model="productForm" :rules="productRules" ref="productFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="productForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="productForm.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="productForm.stock" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio value="online">上架</el-radio>
            <el-radio value="offline">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Download } from '@element-plus/icons-vue'

interface Product {
  id: number
  name: string
  sku: string
  category: string
  price: number
  stock: number
  sales: number
  status: string
  imageBg: string
}

const categories = ['数码电子', '服饰鞋包', '美妆个护', '食品生鲜', '家居家装', '母婴玩具']
const statusTypeMap: Record<string, string> = { online: 'success', offline: 'info', pending: 'warning' }
const statusTextMap: Record<string, string> = { online: '已上架', offline: '已下架', pending: '待审核' }

const loading = ref(false)
const selectedRows = ref<Product[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增商品')
const productFormRef = ref<FormInstance>()
const editingId = ref<number | null>(null)

const filterForm = reactive({
  name: '',
  category: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const productForm = reactive({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  status: 'online'
})

const productRules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }]
}

const productNames = [
  'iPhone 15 Pro Max', '华为 Mate 60 Pro', '小米14 Ultra', 'AirPods Pro 2',
  '戴森 V15 吸尘器', 'SK-II 神仙水', '雅诗兰黛小棕瓶', 'Nike Air Jordan 1',
  '始祖鸟冲锋衣', '索尼 WH-1000XM5', '大疆 Mini 4 Pro', '罗技 MX Master 3S',
  'Kindle Paperwhite', '飞利浦电动牙刷', '兰蔻菁纯面霜', 'iPad Pro 12.9',
  'MacBook Pro 14', 'Switch OLED', '戴森吹风机', 'Levi\'s 501牛仔裤'
]

const imageBgs = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a8edea, #fed6e3)'
]

const allProducts = ref<Product[]>([])

function generateProducts() {
  const list: Product[] = []
  for (let i = 1; i <= 86; i++) {
    const name = productNames[Math.floor(Math.random() * productNames.length)]
    list.push({
      id: i,
      name: `${name} ${['标准版', 'Pro版', '旗舰版', '套装版'][Math.floor(Math.random() * 4)]}`,
      sku: `SKU${String(i).padStart(6, '0')}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 9900 + 99),
      stock: Math.floor(Math.random() * 5000),
      sales: Math.floor(Math.random() * 50000),
      status: ['online', 'online', 'online', 'offline', 'pending'][Math.floor(Math.random() * 5)],
      imageBg: imageBgs[Math.floor(Math.random() * imageBgs.length)]
    })
  }
  allProducts.value = list
}

const tableData = computed(() => {
  let filtered = allProducts.value

  if (filterForm.name) {
    filtered = filtered.filter((p) => p.name.includes(filterForm.name))
  }
  if (filterForm.category) {
    filtered = filtered.filter((p) => p.category === filterForm.category)
  }
  if (filterForm.status) {
    filtered = filtered.filter((p) => p.status === filterForm.status)
  }

  pagination.total = filtered.length
  const start = (pagination.page - 1) * pagination.pageSize
  return filtered.slice(start, start + pagination.pageSize)
})

function handleSearch() {
  pagination.page = 1
  loading.value = true
  setTimeout(() => (loading.value = false), 300)
}

function handleReset() {
  filterForm.name = ''
  filterForm.category = ''
  filterForm.status = ''
  handleSearch()
}

function handleSelectionChange(rows: Product[]) {
  selectedRows.value = rows
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handleCurrentChange(page: number) {
  pagination.page = page
}

function handleAdd() {
  dialogTitle.value = '新增商品'
  editingId.value = null
  Object.assign(productForm, { name: '', category: '', price: 0, stock: 0, status: 'online' })
  dialogVisible.value = true
}

function handleEdit(row: Product) {
  dialogTitle.value = '编辑商品'
  editingId.value = row.id
  Object.assign(productForm, { name: row.name, category: row.category, price: row.price, stock: row.stock, status: row.status })
  dialogVisible.value = true
}

function handleSubmit() {
  productFormRef.value?.validate((valid) => {
    if (!valid) return
    if (editingId.value) {
      const product = allProducts.value.find((p) => p.id === editingId.value)
      if (product) Object.assign(product, productForm)
      ElMessage.success('修改成功')
    } else {
      const newId = Math.max(...allProducts.value.map((p) => p.id)) + 1
      allProducts.value.unshift({
        id: newId,
        ...productForm,
        sku: `SKU${String(newId).padStart(6, '0')}`,
        sales: 0,
        imageBg: imageBgs[Math.floor(Math.random() * imageBgs.length)]
      })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
  })
}

function handleOnline(row: Product) {
  row.status = 'online'
  ElMessage.success('上架成功')
}

function handleOffline(row: Product) {
  row.status = 'offline'
  ElMessage.success('下架成功')
}

function handleDelete(row: Product) {
  ElMessageBox.confirm(`确定删除商品「${row.name}」吗？`, '提示', { type: 'warning' })
    .then(() => {
      allProducts.value = allProducts.value.filter((p) => p.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function handleBatchOnline() {
  selectedRows.value.forEach((p) => (p.status = 'online'))
  ElMessage.success(`已批量上架 ${selectedRows.value.length} 件商品`)
}

function handleBatchOffline() {
  selectedRows.value.forEach((p) => (p.status = 'offline'))
  ElMessage.success(`已批量下架 ${selectedRows.value.length} 件商品`)
}

function handleBatchDelete() {
  ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 件商品吗？`, '提示', { type: 'warning' })
    .then(() => {
      const ids = selectedRows.value.map((p) => p.id)
      allProducts.value = allProducts.value.filter((p) => !ids.includes(p.id))
      ElMessage.success('批量删除成功')
    })
    .catch(() => {})
}

function handleExport() {
  ElMessage.success('导出成功，文件已开始下载')
}

onMounted(() => {
  generateProducts()
})
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.el-card) {
  background: rgba(15, 23, 58, 0.6);
  border: 1px solid rgba(79, 140, 255, 0.15);
  border-radius: 8px;
}

:deep(.el-card__body) {
  padding: 20px;
}

.filter-form {
  :deep(.el-form-item__label) {
    color: rgba(255, 255, 255, 0.7);
  }
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.product-detail {
  .product-name {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 4px;
  }
  .product-sku {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }
}

.price {
  color: #ef476f;
  font-weight: 600;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(79, 140, 255, 0.1);
  --el-table-text-color: rgba(255, 255, 255, 0.8);
  --el-table-header-text-color: rgba(255, 255, 255, 0.9);
  --el-table-border-color: rgba(79, 140, 255, 0.15);
  --el-table-row-hover-bg-color: rgba(79, 140, 255, 0.08);
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 0 1px rgba(79, 140, 255, 0.2) inset;
}

:deep(.el-input__inner) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-select__placeholder),
:deep(.el-input__placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.el-dialog) {
  background: #0f173a;
  border: 1px solid rgba(79, 140, 255, 0.2);
}

:deep(.el-dialog__title) {
  color: #fff;
}

:deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-radio__label) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-text-color: rgba(255, 255, 255, 0.7);
  --el-pagination-button-color: rgba(255, 255, 255, 0.7);
  --el-pagination-hover-color: #4f8cff;
}
</style>
