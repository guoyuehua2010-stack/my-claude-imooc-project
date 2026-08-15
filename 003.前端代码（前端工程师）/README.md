# 财务管家 - 前端代码

> 财务管家是一款轻量、便捷、高颜值的个人/商户记账工具 Web 应用。

## 📁 项目结构

```
003.前端代码（前端工程师）/
├── README.md              # 项目说明文档
├── css/
│   └── styles.css        # 统一样式表（Design System）
├── js/
│   └── router.js          # 路由导航模块
├── pages/                 # 页面文件
│   ├── auth/              # 认证相关页面
│   │   ├── login.html     # 登录页
│   │   └── register.html  # 注册页
│   └── main/             # 主要功能页面
│       ├── home.html      # 首页（今日概览）
│       ├── add.html       # 记账页（添加交易）
│       ├── bills.html     # 账单页（分析统计）
│       └── profile.html   # 我的页（个人设置）
├── assets/               # 静态资源
│   └── images/           # 图片资源
└── frontend/             # 原始设计原型（stitch生成）
    ├── _1/               # 账单分析页原型
    ├── _2/               # 个人设置页原型
    ├── _3/               # 注册页原型
    ├── _4/               # 登录页原型
    ├── _5/               # 首页原型
    ├── _6/               # 添加交易页原型
    └── sakura_ledger/
        └── DESIGN.md      # 设计规范文档
```

## 🚀 快速开始

### 方式一：直接打开

直接用浏览器打开 `pages/main/home.html` 即可预览。

### 方式二：本地服务器

```bash
# 使用 npx serve
npx serve .

# 或使用 Python
python -m http.server 8080

# 然后访问 http://localhost:3000/pages/main/home.html
```

## 📱 页面说明

| 页面 | 路径 | 说明 |
|------|------|------|
| 登录 | `pages/auth/login.html` | 用户名+密码登录 |
| 注册 | `pages/auth/register.html` | 用户名+密码+确认密码注册 |
| 首页 | `pages/main/home.html` | 今日概览、最近记录、预算进度 |
| 记账 | `pages/main/add.html` | 选择分类、输入金额、添加备注 |
| 账单 | `pages/main/bills.html` | 月度统计、支出构成图、趋势图 |
| 我的 | `pages/main/profile.html` | 用户信息、预算设置、数据管理 |

## 🔗 页面导航

```
启动应用
    │
    ├── 未登录 ──→ 登录页 (login.html)
    │                  │
    │                  └── 注册 ──→ 注册页 (register.html)
    │
    └── 已登录 ──→ 首页 (home.html)
                        │
                        ├── 记账 ──→ 添加页 (add.html)
                        │               └── 保存 ──→ 返回首页
                        │
                        ├── 账单 ──→ 账单页 (bills.html)
                        │
                        └── 我的 ──→ 个人页 (profile.html)
                                           │
                                           └── 退出登录 ──→ 登录页
```

## 🎨 设计规范

- **设计风格**：Soft-Kawaii（柔美可爱）
- **主色调**：樱花粉 `#874d5b` + 薰衣草紫 `#744f90`
- **背景色**：奶油白 `#FFF9FA`
- **语义色**：支出-珊瑚粉 `#FF8A8A`，收入-薄荷绿 `#A8E6CF`
- **圆角**：卡片 16px，按钮 12px，输入框 12px
- **字体**：Plus Jakarta Sans（标题）+ Be Vietnam Pro（正文）

详见 [frontend/sakura_ledger/DESIGN.md](frontend/sakura_ledger/DESIGN.md)

## 🛠️ 技术栈

- **HTML5** - 语义化标签
- **Tailwind CSS** - 实用优先样式框架（CDN）
- **Chart.js** - 图表库（CDN）
- **LocalStorage** - 本地数据持久化
- **Material Symbols** - 图标库

## 📋 功能清单

### P0 - MVP

- [x] 用户注册/登录
- [x] 快速记账（支出/收入）
- [x] 收支分类（15个分类）
- [x] 首页今日概览
- [x] 月度账单查看
- [x] 收支趋势图
- [x] 月份结余统计

### P1 - 应该有

- [ ] 月度预算设置
- [ ] 账单搜索与筛选
- [ ] 数据导出 (CSV)
- [ ] 消费分类饼图

### P2 - 可以有

- [ ] 多账本支持
- [ ] 周期性账单
- [ ] 数据备份/恢复

## 📝 开发说明

### 添加新页面

1. 在 `pages/main/` 下创建新 HTML 文件
2. 引入统一样式：` <link href="../../css/styles.css" rel="stylesheet"> `
3. 引入 Tailwind 配置（参考现有页面）
4. 添加底部 Tab 导航
5. 在 `js/router.js` 中注册路由

### 修改样式

- CSS 变量定义在 `css/styles.css` 顶部
- Tailwind 扩展配置在各页面 `<script>` 标签中
- 优先使用 CSS 变量，其次使用 Tailwind 类

## 📄 许可证

MIT License

---

*版本：v1.0.1 | 更新日期：2026-08-15*
