# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供在此代码仓库中工作的指导。

## 项目概述

这是一个个人财务管理 Web 应用，包含两个主要部分：

- **001.产品PRD(产品经理)/** — 产品需求文档
- **002.website(网站)/** — Web 应用（单个 HTML 文件）

## 运行网站

网站是一个静态 HTML 文件，可直接在浏览器中打开：

```
002.website(网站)/index.html
```

或使用本地服务器：

```bash
cd "002.website(网站)"
npx serve .
# 然后访问 http://localhost:3000
```

## 架构说明

- 单文件 Web 应用，使用原生 HTML/CSS/JavaScript
- Chart.js 通过 CDN 加载，用于趋势图表
- 数据存储在浏览器 LocalStorage 中（无后端）
- 移动端优先的响应式设计（320px-428px）
- 粉色/柔和配色方案，圆角设计

## 常用命令

| 命令 | 说明 |
|------|------|
| 在浏览器中打开 `index.html` | 查看/运行应用 |
| `npx serve .` | 启动本地静态服务器 |

## 技术栈

- 原生 HTML/CSS/JavaScript（无框架）
- Chart.js 4.4.0（CDN）
- LocalStorage 数据持久化
