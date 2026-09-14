<template>
  <div class="page-container">
    <div class="profile-layout">
      <el-card class="info-card" shadow="never">
        <div class="avatar-section">
          <el-avatar :size="100" class="user-avatar">
            <el-icon :size="48"><User /></el-icon>
          </el-avatar>
          <h2 class="user-name">{{ userInfo.username }}</h2>
          <el-tag type="primary" size="large">{{ userInfo.role }}</el-tag>
        </div>
        <el-divider />
        <div class="info-list">
          <div class="info-item"><span class="info-label">账号ID</span><span class="info-value">{{ userInfo.id }}</span></div>
          <div class="info-item"><span class="info-label">邮箱</span><span class="info-value">{{ userInfo.email }}</span></div>
          <div class="info-item"><span class="info-label">手机</span><span class="info-value">{{ userInfo.phone }}</span></div>
          <div class="info-item"><span class="info-label">部门</span><span class="info-value">{{ userInfo.department }}</span></div>
          <div class="info-item"><span class="info-label">入职时间</span><span class="info-value">{{ userInfo.joinDate }}</span></div>
          <div class="info-item"><span class="info-label">最后登录</span><span class="info-value">{{ userInfo.lastLogin }}</span></div>
        </div>
      </el-card>

      <div class="settings-section">
        <el-card class="settings-card" shadow="never">
          <template #header><span class="card-title">基本信息</span></template>
          <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="profileForm.username" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="profileForm.nickname" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="profileForm.phone" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="profileForm.bio" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveProfile">保存修改</el-button>
              <el-button @click="handleResetProfile">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="settings-card" shadow="never">
          <template #header><span class="card-title">修改密码</span></template>
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword">确认修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="settings-card" shadow="never">
          <template #header><span class="card-title">系统设置</span></template>
          <div class="setting-list">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">消息通知</div>
                <div class="setting-desc">接收系统消息和订单提醒</div>
              </div>
              <el-switch v-model="settings.notification" />
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">声音提醒</div>
                <div class="setting-desc">新订单到达时播放提示音</div>
              </div>
              <el-switch v-model="settings.sound" />
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">自动刷新</div>
                <div class="setting-desc">数据页面自动刷新</div>
              </div>
              <el-switch v-model="settings.autoRefresh" />
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-name">深色模式</div>
                <div class="setting-desc">使用深色主题</div>
              </div>
              <el-switch v-model="settings.darkMode" disabled />
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User } from '@element-plus/icons-vue'

const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const userInfo = ref({
  username: JSON.parse(localStorage.getItem('userInfo') || '{}').username || 'admin',
  role: '系统管理员',
  id: 'U10086',
  email: 'admin@example.com',
  phone: '138****8888',
  department: '运营部',
  joinDate: '2023-01-15',
  lastLogin: '2026-09-11 09:30:00'
})

const profileForm = reactive({
  username: userInfo.value.username,
  nickname: '超级管理员',
  email: userInfo.value.email,
  phone: '13888888888',
  bio: '负责电商平台整体运营管理'
})

const profileRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }]
}

const passwordForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const validateConfirm = (_rule: any, value: string, callback: any) => {
  if (value !== passwordForm.newPassword) callback(new Error('两次输入的密码不一致'))
  else callback()
}

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: validateConfirm, trigger: 'blur' }]
}

const settings = reactive({ notification: true, sound: true, autoRefresh: true, darkMode: true })

function handleSaveProfile() {
  profileFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('个人信息保存成功')
      userInfo.value.username = profileForm.username
      userInfo.value.email = profileForm.email
      userInfo.value.phone = profileForm.phone
    }
  })
}

function handleResetProfile() {
  profileForm.username = userInfo.value.username
  profileForm.nickname = '超级管理员'
  profileForm.email = userInfo.value.email
  profileForm.phone = '13888888888'
  profileForm.bio = '负责电商平台整体运营管理'
}

function handleChangePassword() {
  passwordFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('密码修改成功，请重新登录')
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.profile-layout { display: grid; grid-template-columns: 320px 1fr; gap: 16px; align-items: start; }
.avatar-section { text-align: center; padding: 20px 0; }
.user-avatar { background: linear-gradient(135deg, #4f8cff, #a855f7); color: #fff; margin-bottom: 16px; }
.user-name { font-size: 22px; color: #fff; margin: 0 0 12px; }
.info-list { display: flex; flex-direction: column; gap: 14px; }
.info-item { display: flex; justify-content: space-between; font-size: 14px; }
.info-label { color: rgba(255,255,255,0.5); }
.info-value { color: rgba(255,255,255,0.9); }
.settings-section { display: flex; flex-direction: column; gap: 16px; }
.card-title { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9); }
.setting-list { display: flex; flex-direction: column; gap: 4px; }
.setting-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(79,140,255,0.08); &:last-child { border-bottom: none; } }
.setting-name { font-size: 14px; color: rgba(255,255,255,0.9); margin-bottom: 4px; }
.setting-desc { font-size: 12px; color: rgba(255,255,255,0.4); }
:deep(.el-card) { background: rgba(15,23,58,0.6); border: 1px solid rgba(79,140,255,0.15); border-radius: 8px; }
:deep(.el-card__header) { padding: 14px 20px; border-bottom: 1px solid rgba(79,140,255,0.1); }
:deep(.el-card__body) { padding: 20px; }
:deep(.el-divider) { border-color: rgba(79,140,255,0.1); }
:deep(.el-input__wrapper) { background: rgba(255,255,255,0.05); box-shadow: 0 0 0 1px rgba(79,140,255,0.2) inset; }
:deep(.el-input__inner) { color: rgba(255,255,255,0.9); }
:deep(.el-form-item__label) { color: rgba(255,255,255,0.7); }
:deep(.el-textarea__inner) { background: rgba(255,255,255,0.05); border-color: rgba(79,140,255,0.2); color: rgba(255,255,255,0.9); }
</style>
