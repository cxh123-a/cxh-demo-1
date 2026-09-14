<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
      <div class="logo-area" @click="router.push('/screen')">
        <el-icon :size="28" color="#4f8cff"><DataAnalysis /></el-icon>
        <span v-show="!isCollapse" class="logo-text">电商运营平台</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        class="side-menu"
        background-color="transparent"
        text-color="rgba(255,255,255,0.7)"
        active-text-color="#4f8cff"
      >
        <template v-for="group in menuGroups" :key="group.title">
          <div v-if="group.title && !isCollapse" class="menu-group-title">{{ group.title }}</div>
          <el-menu-item
            v-for="item in group.items"
            :key="item.path"
            :index="item.path"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container class="layout-main">
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-btn" :size="20" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/screen' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-tooltip content="全屏">
            <el-icon class="header-icon" :size="18" @click="toggleFullscreen">
              <FullScreen v-if="!isFullscreen" />
              <Aim v-else />
            </el-icon>
          </el-tooltip>

          <el-tooltip content="通知">
            <el-badge :value="5" class="header-badge">
              <el-icon class="header-icon" :size="18"><Bell /></el-icon>
            </el-badge>
          </el-tooltip>

          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" class="user-avatar">
                <el-icon :size="18"><User /></el-icon>
              </el-avatar>
              <span class="user-name">{{ userInfo.username }}</span>
              <el-icon :size="14"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="layout-content" :class="{ 'full-screen-content': isFullScreenRoute }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  DataAnalysis,
  Goods,
  TrendCharts,
  List,
  View,
  Van,
  Document,
  User,
  Fold,
  Expand,
  FullScreen,
  Aim,
  Bell,
  ArrowDown,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const isCollapse = ref(false)
const isFullscreen = ref(false)

const userInfo = ref({
  username: JSON.parse(localStorage.getItem('userInfo') || '{}').username || 'admin',
  role: '管理员'
})

const menuGroups = [
  {
    title: '数据中心',
    items: [
      { path: '/screen', title: '运营大屏', icon: DataAnalysis }
    ]
  },
  {
    title: '商品管理',
    items: [
      { path: '/product/list', title: '商品列表', icon: Goods },
      { path: '/product/analysis', title: '商品分析', icon: TrendCharts }
    ]
  },
  {
    title: '交易管理',
    items: [
      { path: '/order/list', title: '订单管理', icon: List }
    ]
  },
  {
    title: '运营分析',
    items: [
      { path: '/traffic', title: '流量分析', icon: View },
      { path: '/logistics', title: '物流管理', icon: Van },
      { path: '/report', title: '数据报表', icon: Document }
    ]
  },
  {
    title: '系统',
    items: [
      { path: '/profile', title: '个人中心', icon: User }
    ]
  }
]

const activeMenu = computed(() => route.path)
const currentTitle = computed(() => (route.meta.title as string) || '')
const isFullScreenRoute = computed(() => route.meta.isFullScreen === true)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function handleCommand(command: string) {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'settings') {
    ElMessage.info('系统设置功能开发中')
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.success('已退出登录')
      router.push('/login')
    }).catch(() => {})
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  background: #0a0e27;
}

.layout-aside {
  background: linear-gradient(180deg, #0f173a 0%, #0a0e27 100%);
  border-right: 1px solid rgba(79, 140, 255, 0.15);
  transition: width 0.3s ease;
  overflow: hidden;
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-bottom: 1px solid rgba(79, 140, 255, 0.15);
  cursor: pointer;

  .logo-text {
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(135deg, #fff, #4f8cff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    white-space: nowrap;
  }
}

.menu-group-title {
  padding: 16px 20px 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
}

.side-menu {
  border-right: none;
  padding: 8px 0;

  :deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
    margin: 2px 10px;
    border-radius: 8px;
    font-size: 14px;

    &:hover {
      background: rgba(79, 140, 255, 0.1) !important;
    }

    &.is-active {
      background: linear-gradient(90deg, rgba(79, 140, 255, 0.2), rgba(168, 85, 247, 0.1)) !important;
      border-left: 3px solid #4f8cff;
    }
  }

  :deep(.el-menu-item .el-icon) {
    font-size: 18px;
  }
}

.layout-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(15, 23, 58, 0.8);
  border-bottom: 1px solid rgba(79, 140, 255, 0.15);
  backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #4f8cff;
  }
}

:deep(.el-breadcrumb__inner) {
  color: rgba(255, 255, 255, 0.5) !important;

  &.is-link {
    &:hover {
      color: #4f8cff !important;
    }
  }
}

:deep(.el-breadcrumb__separator) {
  color: rgba(255, 255, 255, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon {
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #4f8cff;
  }
}

.header-badge {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: rgba(79, 140, 255, 0.1);
  }
}

.user-avatar {
  background: linear-gradient(135deg, #4f8cff, #a855f7);
  color: #fff;
}

.user-name {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.layout-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #0a0e27;

  &.full-screen-content {
    padding: 0;
    overflow: hidden;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(79, 140, 255, 0.3);
    border-radius: 3px;
  }
}

:deep(.el-dropdown-menu) {
  background: rgba(15, 23, 58, 0.95);
  border: 1px solid rgba(79, 140, 255, 0.2);
}

:deep(.el-dropdown-menu__item) {
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    background: rgba(79, 140, 255, 0.15);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
