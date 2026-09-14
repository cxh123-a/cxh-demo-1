<template>
  <div class="login-container">
    <div class="login-bg">
      <div class="bg-grid"></div>
      <div class="bg-glow bg-glow-1"></div>
      <div class="bg-glow bg-glow-2"></div>
    </div>

    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <el-icon :size="40" color="#4f8cff"><DataAnalysis /></el-icon>
        </div>
        <h1 class="login-title">电商运营管理平台</h1>
        <p class="login-subtitle">E-Commerce Operations Management System</p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input
              v-model="loginForm.captcha"
              placeholder="验证码"
              size="large"
              :prefix-icon="Key"
            />
            <div class="captcha-box" @click="refreshCaptcha">
              <span>{{ captchaCode }}</span>
            </div>
          </div>
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <a class="forgot-link" href="javascript:;">忘记密码？</a>
        </div>

        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>

      <div class="login-footer">
        <p>演示账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Key, DataAnalysis } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const captchaCode = ref('')

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
  remember: true
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  captchaCode.value = code
}

function refreshCaptcha() {
  generateCaptcha()
}

async function handleLogin() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (loginForm.captcha.toUpperCase() !== captchaCode.value) {
      ElMessage.error('验证码错误')
      generateCaptcha()
      return
    }

    loading.value = true

    setTimeout(() => {
      if (loginForm.username === 'admin' && loginForm.password === '123456') {
        localStorage.setItem('token', 'mock-token-' + Date.now())
        localStorage.setItem('userInfo', JSON.stringify({ username: 'admin', role: '管理员' }))
        ElMessage.success('登录成功')
        const redirect = (route.query.redirect as string) || '/screen'
        router.push(redirect)
      } else {
        ElMessage.error('用户名或密码错误')
      }
      loading.value = false
    }, 800)
  })
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0e27;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(79, 140, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79, 140, 255, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;

  &.bg-glow-1 {
    width: 500px;
    height: 500px;
    top: -100px;
    left: -100px;
    background: radial-gradient(circle, #4f8cff, transparent);
  }

  &.bg-glow-2 {
    width: 400px;
    height: 400px;
    bottom: -100px;
    right: -100px;
    background: radial-gradient(circle, #a855f7, transparent);
  }
}

.login-box {
  width: 440px;
  padding: 48px 40px;
  background: rgba(15, 23, 58, 0.85);
  border: 1px solid rgba(79, 140, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(79, 140, 255, 0.1);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, rgba(79, 140, 255, 0.2), rgba(168, 85, 247, 0.2));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(79, 140, 255, 0.3);
}

.login-title {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #fff, #4f8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  letter-spacing: 1px;
}

.login-form {
  :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 1px rgba(79, 140, 255, 0.2) inset;
    border-radius: 8px;

    &:hover {
      box-shadow: 0 0 0 1px rgba(79, 140, 255, 0.4) inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px #4f8cff inset, 0 0 10px rgba(79, 140, 255, 0.2);
    }
  }

  :deep(.el-input__inner) {
    color: #fff;
    height: 44px;
  }

  :deep(.el-input__prefix-inner) {
    color: rgba(255, 255, 255, 0.4);
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

.captcha-row {
  display: flex;
  gap: 12px;

  .el-input {
    flex: 1;
  }
}

.captcha-box {
  width: 110px;
  height: 44px;
  background: linear-gradient(135deg, rgba(79, 140, 255, 0.2), rgba(168, 85, 247, 0.2));
  border: 1px solid rgba(79, 140, 255, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;

  &:hover {
    border-color: rgba(79, 140, 255, 0.6);
  }

  span {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #fff;
    font-style: italic;
    text-shadow: 0 0 10px rgba(79, 140, 255, 0.5);
  }
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  :deep(.el-checkbox__label) {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }

  :deep(.el-checkbox__inner) {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(79, 140, 255, 0.3);
  }
}

.forgot-link {
  color: #4f8cff;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    color: #6a9fff;
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #4f8cff, #a855f7);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(79, 140, 255, 0.4);

  &:hover {
    background: linear-gradient(135deg, #6a9fff, #b86dff);
    box-shadow: 0 6px 25px rgba(79, 140, 255, 0.6);
    transform: translateY(-1px);
  }
}

.login-footer {
  text-align: center;
  margin-top: 24px;

  p {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.35);
    margin: 0;
  }
}
</style>
