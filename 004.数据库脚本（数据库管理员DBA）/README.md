# 财务管家 - 数据库设计文档

## 1. 概述

本文档描述了财务管家个人财务管理系统的数据库结构设计。

### 1.1 设计原则

- **规范化设计**：遵循数据库第三范式（3NF），减少数据冗余
- **安全性**：密码使用 SHA-256 + Salt 加密存储
- **可扩展性**：预留字段和扩展性设计，支持后续功能迭代
- **性能优先**：合理建立索引，优化查询性能

### 1.2 技术栈

- **数据库**：MySQL 9.7.0
- **字符集**：UTF-8 MB4（支持 emoji 表情）
- **存储引擎**：InnoDB（支持事务和外键）

---

## 2. 数据库结构

### 2.1 ER 图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │────▶│  accounts   │     │ categories  │
│   用户表    │     │   账户表    │     │   分类表    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │              ┌────┴────┐              │
       │              ▼         │              │
       │     ┌─────────────┐    │    ┌─────────────┐
       │     │   records   │◀───┘    │   budgets   │
       │     │  账单记录表  │         │   预算表    │
       │     └─────────────┘         └─────────────┘
       │
       │     ┌─────────────┐     ┌─────────────┐
       ├────▶│   ledgers   │     │  sessions   │
       │     │   账本表    │     │  会话表     │
       │     └─────────────┘     └─────────────┘
       │
       │     ┌─────────────────────┐
       └────▶│ category_budgets    │
             │    分类预算表        │
             └─────────────────────┘
```

### 2.2 表清单

| 序号 | 表名 | 说明 | 关联 |
|------|------|------|------|
| 1 | users | 用户表 | 主表 |
| 2 | accounts | 账户表 | users.id |
| 3 | categories | 分类表 | users.id |
| 4 | records | 账单记录表 | users, categories, accounts |
| 5 | budgets | 预算表 | users.id |
| 6 | category_budgets | 分类预算表 | budgets, categories |
| 7 | ledgers | 账本表 | users.id |
| 8 | sessions | 会话表 | users.id |

---

## 3. 表结构详解

### 3.1 users (用户表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(36) | UUID，主键 |
| username | VARCHAR(20) | 用户名，唯一 |
| password | VARCHAR(255) | SHA-256加密密码 |
| salt | VARCHAR(32) | 密码盐值 |
| avatar | VARCHAR(500) | 头像URL |
| created_at | DATETIME | 注册时间 |
| status | TINYINT | 状态：1正常，0禁用 |

### 3.2 accounts (账户表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 自增主键 |
| user_id | VARCHAR(36) | 用户ID，外键 |
| name | VARCHAR(50) | 账户名称 |
| emoji | VARCHAR(10) | 账户图标 |
| balance | DECIMAL(12,2) | 账户余额 |

**默认账户类型**：现金、微信、支付宝、银行卡

### 3.3 categories (分类表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 自增主键 |
| user_id | VARCHAR(36) | 用户ID（NULL为系统分类） |
| type | ENUM | expense/income |
| name | VARCHAR(50) | 分类名称 |
| emoji | VARCHAR(10) | 分类图标 |
| color | VARCHAR(10) | 颜色代码 |

**支出分类**：餐饮、交通、购物、居住、娱乐、医疗、通讯、教育、其他

**收入分类**：工资、兼职、投资、礼金、生意、其他

### 3.4 records (账单记录表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 自增主键 |
| user_id | VARCHAR(36) | 用户ID |
| type | ENUM | expense/income |
| amount | DECIMAL(12,2) | 金额 |
| category_id | INT | 分类ID |
| account_id | INT | 账户ID |
| note | VARCHAR(200) | 备注 |
| record_date | DATE | 记录日期 |
| month | VARCHAR(7) | 所属月份(YYYY-MM) |

### 3.5 budgets (预算表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 自增主键 |
| user_id | VARCHAR(36) | 用户ID |
| month | VARCHAR(7) | 月份(YYYY-MM) |
| total_limit | DECIMAL(12,2) | 月度预算上限 |

### 3.6 category_budgets (分类预算表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 自增主键 |
| budget_id | INT | 预算ID |
| category_id | INT | 分类ID |
| limit_amount | DECIMAL(12,2) | 分类预算 |

### 3.7 ledgers (账本表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 自增主键 |
| user_id | VARCHAR(36) | 用户ID |
| name | VARCHAR(50) | 账本名称 |
| description | VARCHAR(200) | 描述 |
| is_default | TINYINT | 是否默认账本 |

### 3.8 sessions (会话表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(36) | 会话ID(UUID) |
| user_id | VARCHAR(36) | 用户ID |
| token | VARCHAR(255) | 会话Token |
| expires_at | DATETIME | 过期时间 |

---

## 4. 索引设计

| 表名 | 索引名 | 字段 | 类型 |
|------|--------|------|------|
| users | idx_username | username | 普通 |
| users | idx_status | status | 普通 |
| accounts | idx_user_id | user_id | 普通 |
| categories | idx_user_id | user_id | 普通 |
| categories | idx_type | type | 普通 |
| records | idx_user_id | user_id | 普通 |
| records | idx_month | month | 普通 |
| records | idx_user_month | user_id, month | 复合 |
| budgets | uk_user_month | user_id, month | 唯一 |

---

## 5. 使用说明

### 5.1 执行脚本

```bash
# 连接 MySQL
mysql -uroot -proot -h127.0.0.1

# 执行创建脚本
source schema.sql
```

### 5.2 查看数据库

```sql
SHOW DATABASES;
USE financial_manager;
SHOW TABLES;
```

### 5.3 查看表结构

```sql
DESC users;
DESC records;
```

---

## 6. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0.1 | 2026-08-16 | 初始版本，包含8张表 |

---

*文档版本：v1.0.1*
*更新日期：2026-08-16*
*作者：DBA*
