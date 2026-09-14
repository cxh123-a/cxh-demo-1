# 品牌电商全链路运营数据可视化大屏

基于 Vue3 + Vite + TypeScript + Pinia + ECharts 构建的企业级电商数据可视化大屏。

## 技术栈

- **核心框架**: Vue 3.4+ 组合式 API + Vite 5.x + TypeScript
- **状态管理**: Pinia
- **可视化**: ECharts 5.5+ 自定义大屏主题
- **动效**: 数字滚动 + CSS3 流光 / 呼吸光效
- **样式**: SCSS + 全局 CSS 变量主题化管理
- **工程规范**: ESLint + Prettier

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 项目结构

```
ecommerce-data-screen/
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 字体、装饰素材、背景图、全局样式
│   │   └── styles/         # SCSS 变量与全局样式
│   ├── components/         # 通用可复用基础组件
│   │   ├── ScreenCard.vue       # 大屏卡片
│   │   ├── CountUpNumber.vue    # 数字滚动
│   │   ├── ScrollList.vue       # 无缝滚动列表
│   │   └── GradientProgress.vue # 渐变进度条
│   ├── charts/             # 业务图表组件
│   │   ├── ChannelPie.vue       # 流量来源渠道占比
│   │   ├── TrafficFunnel.vue    # 用户转化漏斗图
│   │   ├── VisitorTrend.vue     # 24小时访客趋势
│   │   ├── ProductRank.vue      # 热销商品TOP10
│   │   ├── CategoryPie.vue      # 品类销售占比
│   │   ├── RegionMap.vue        # 各省订单地域分布
│   │   └── SalesTrend.vue       # 销售趋势
│   ├── store/              # Pinia 全局数据状态管理
│   ├── mock/               # 全量Mock数据 + 定时刷新模拟逻辑
│   ├── utils/              # 工具函数
│   │   ├── scale.ts             # 大屏自适应
│   │   ├── format.ts            # 数值金额格式化
│   │   └── echarts.ts           # ECharts主题配置
│   ├── views/              # 大屏主页面
│   ├── App.vue
│   └── main.ts
├── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 功能模块

### 顶部核心 KPI 区
- GMV、订单量、访客数、转化率、客单价、目标完成率 6 个核心指标
- 数字滚动动效 + 同比环比标识

### 左侧流量转化区
- 流量来源渠道占比（环形图）
- 用户转化漏斗图
- 近 24 小时实时访客趋势折线图

### 中间核心作战区
- 超大实时 GMV 数字跳动
- 大促目标完成进度条
- 峰值销量播报
- 近7天销售趋势

### 右侧商品分析区
- 热销商品 TOP10 排行
- 品类销售占比环形图
- 实时订单动态滚动

### 底部物流履约区
- 各省订单地域分布热力图
- 物流时效状态滚动列表

## 视觉与动效

- **整体风格**: 深色深空底色 + 蓝紫渐变发光体系
- **卡片样式**: 统一流光边框 + 柔光阴影，标题栏渐变流光扫动
- **入场动效**: 各模块错峰渐显入场，图表初始化动画
- **数据动效**: 数值平滑滚动过渡，数据定时刷新无跳变
- **微交互**: hover 卡片上浮 + 发光增强，图表 hover 高亮

## 工程特性

- **自适应**: transform: scale 等比缩放，兼容 1080P~8K
- **性能优化**: 图表懒加载、数据更新节流、DOM 复用
- **组件复用**: 基础 UI 组件全封装，新增图表仅需配置数据
- **低耦合**: 数据层与视图层完全分离，对接真实接口仅需替换 Mock 层
- **全量 Mock**: 模拟秒级实时刷新，无需后端接口

## 对接真实接口

替换 `src/mock/` 目录下的数据生成逻辑为真实 API 请求即可，数据层与视图层已完全分离。
