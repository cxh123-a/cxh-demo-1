# 部署到 GitHub Pages 指南

## 前置准备

### 1. 安装 Git

下载并安装 Git：https://git-scm.com/download/win

安装完成后，打开命令行验证：
```bash
git --version
```

### 2. 配置 Git 用户名和邮箱
```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

### 3. 注册 GitHub 账号

如果还没有 GitHub 账号，前往 https://github.com 注册。

---

## 部署步骤

### 第一步：在 GitHub 上创建仓库

1. 登录 GitHub，点击右上角 `+` → `New repository`
2. 仓库名填写：`ecommerce-data-screen`（或任意名称）
3. 选择 `Public`（公开仓库，GitHub Pages 免费）
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 `Create repository`

### 第二步：本地初始化并推送代码

在项目目录 `D:\前端作品\demo1\ecommerce-data-screen` 下打开命令行，依次执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "feat: 电商运营数据可视化大屏完整项目"

# 关联远程仓库（将 你的用户名 替换为实际的GitHub用户名）
git remote add origin https://github.com/你的用户名/ecommerce-data-screen.git

# 重命名分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

### 第三步：启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 `Settings` → 左侧菜单 `Pages`
3. `Build and deployment` → `Source` 选择 `GitHub Actions`
4. 保存设置

### 第四步：触发自动部署

项目已配置 GitHub Actions 自动部署工作流（`.github/workflows/deploy.yml`）：

- 每次推送到 `main` 分支会自动触发构建和部署
- 也可以在仓库页面 `Actions` 标签页手动触发
- 部署完成后，访问地址为：`https://你的用户名.github.io/ecommerce-data-screen/`

---

## 常见问题

### Q: 推送时提示需要认证？
A: GitHub 已不再支持密码认证，需要使用 Personal Access Token：
1. GitHub 右上角头像 → `Settings` → `Developer settings` → `Personal access tokens` → `Tokens (classic)`
2. 点击 `Generate new token`，勾选 `repo` 权限，生成 token
3. 推送时用户名填 GitHub 用户名，密码填生成的 token

### Q: 部署后页面空白？
A: 检查浏览器控制台，通常是资源路径问题。确认 `vite.config.ts` 中的 `base` 路径与仓库名一致。

### Q: 如何更新部署？
A: 修改代码后执行：
```bash
git add .
git commit -m "更新说明"
git push
```
GitHub Actions 会自动重新构建部署。

---

## 本地预览构建结果

```bash
# 构建
npm run build

# 本地预览构建产物
npm run preview
```
