import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/views/layout/LayoutView.vue'),
    redirect: '/screen',
    meta: { requiresAuth: true },
    children: [
      { path: 'screen', name: 'Screen', component: () => import('@/views/ScreenView.vue'), meta: { title: '运营大屏', icon: 'DataAnalysis', isFullScreen: true } },
      { path: 'product/list', name: 'ProductList', component: () => import('@/views/product/ProductList.vue'), meta: { title: '商品列表', icon: 'Goods' } },
      { path: 'product/analysis', name: 'ProductAnalysis', component: () => import('@/views/product/ProductAnalysis.vue'), meta: { title: '商品分析', icon: 'TrendCharts' } },
      { path: 'order/list', name: 'OrderList', component: () => import('@/views/order/OrderList.vue'), meta: { title: '订单管理', icon: 'List' } },
      { path: 'traffic', name: 'Traffic', component: () => import('@/views/traffic/TrafficView.vue'), meta: { title: '流量分析', icon: 'View' } },
      { path: 'logistics', name: 'Logistics', component: () => import('@/views/logistics/LogisticsView.vue'), meta: { title: '物流管理', icon: 'Van' } },
      { path: 'report', name: 'Report', component: () => import('@/views/report/ReportView.vue'), meta: { title: '数据报表', icon: 'Document' } },
      { path: 'profile', name: 'Profile', component: () => import('@/views/profile/ProfileView.vue'), meta: { title: '个人中心', icon: 'User' } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/screen' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)
  if (requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.path === '/login' && token) {
    next({ path: '/screen' })
  } else {
    next()
  }
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || '电商运营后台'
})

export default router
