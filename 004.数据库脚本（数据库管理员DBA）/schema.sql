-- ============================================
-- 财务管家 - 数据库设计文档
-- 版本: v1.0.1
-- 创建日期: 2026-08-16
-- 作者: DBA
-- 描述: 个人财务管理系统的数据库结构
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS financial_manager
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE financial_manager;

-- ============================================
-- 1. 用户表 (users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id              VARCHAR(36) PRIMARY KEY COMMENT '用户唯一标识符(UUID)',
    username        VARCHAR(20) NOT NULL UNIQUE COMMENT '用户名(长度3-20字符)',
    password        VARCHAR(255) NOT NULL COMMENT '密码(SHA-256加密存储)',
    salt            VARCHAR(32) NOT NULL COMMENT '密码盐值',
    avatar          VARCHAR(500) DEFAULT NULL COMMENT '用户头像URL',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    status          TINYINT NOT NULL DEFAULT 1 COMMENT '账号状态: 1正常, 0禁用',
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 2. 账户表 (accounts) - 用户管理的支付账户
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT '账户ID',
    user_id         VARCHAR(36) NOT NULL COMMENT '所属用户ID',
    name            VARCHAR(50) NOT NULL COMMENT '账户名称',
    emoji           VARCHAR(10) NOT NULL DEFAULT '💰' COMMENT '账户图标(emoji)',
    balance         DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    sort_order      INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
    is_deleted      TINYINT NOT NULL DEFAULT 0 COMMENT '软删除标记: 0未删除, 1已删除',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账户表(支付账户如现金、微信、支付宝等)';

-- ============================================
-- 3. 分类表 (categories) - 收支分类
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID',
    user_id         VARCHAR(36) DEFAULT NULL COMMENT '所属用户ID(NULL表示系统默认分类)',
    type            ENUM('expense', 'income') NOT NULL COMMENT '分类类型: expense支出, income收入',
    name            VARCHAR(50) NOT NULL COMMENT '分类名称',
    emoji           VARCHAR(10) NOT NULL COMMENT '分类图标(emoji)',
    color           VARCHAR(10) DEFAULT NULL COMMENT '分类颜色代码',
    parent_id       INT DEFAULT NULL COMMENT '父分类ID(用于二级分类)',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted      TINYINT NOT NULL DEFAULT 0 COMMENT '软删除标记: 0未删除, 1已删除',
    is_system       TINYINT NOT NULL DEFAULT 0 COMMENT '系统分类标记: 0自定义, 1系统默认',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表(收支分类如餐饮、交通、工资等)';

-- ============================================
-- 4. 账单记录表 (records) - 核心业务表
-- ============================================
CREATE TABLE IF NOT EXISTS records (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id         VARCHAR(36) NOT NULL COMMENT '所属用户ID',
    type            ENUM('expense', 'income') NOT NULL COMMENT '收支类型: expense支出, income收入',
    amount          DECIMAL(12, 2) NOT NULL COMMENT '金额(保留2位小数)',
    category_id     INT NOT NULL COMMENT '分类ID',
    account_id      INT NOT NULL COMMENT '账户ID',
    note            VARCHAR(200) DEFAULT NULL COMMENT '备注(最多200字)',
    record_date     DATE NOT NULL COMMENT '记录日期',
    month           VARCHAR(7) NOT NULL COMMENT '所属月份(YYYY-MM格式,用于快速检索)',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted      TINYINT NOT NULL DEFAULT 0 COMMENT '软删除标记: 0未删除, 1已删除',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_category_id (category_id),
    INDEX idx_account_id (account_id),
    INDEX idx_record_date (record_date),
    INDEX idx_month (month),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_user_month (user_id, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单记录表';

-- ============================================
-- 5. 预算表 (budgets) - 月度预算
-- ============================================
CREATE TABLE IF NOT EXISTS budgets (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT '预算ID',
    user_id         VARCHAR(36) NOT NULL COMMENT '所属用户ID',
    month           VARCHAR(7) NOT NULL COMMENT '月份(YYYY-MM)',
    total_limit     DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT '月度支出预算上限',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_month (user_id, month),
    INDEX idx_user_id (user_id),
    INDEX idx_month (month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预算表(月度支出预算)';

-- ============================================
-- 6. 分类预算表 (category_budgets) - 按分类的子预算
-- ============================================
CREATE TABLE IF NOT EXISTS category_budgets (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    budget_id       INT NOT NULL COMMENT '预算ID',
    category_id     INT NOT NULL COMMENT '分类ID',
    limit_amount    DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT '该分类的预算上限',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY uk_budget_category (budget_id, category_id),
    INDEX idx_budget_id (budget_id),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类预算表';

-- ============================================
-- 7. 账本表 (ledgers) - 多账本支持
-- ============================================
CREATE TABLE IF NOT EXISTS ledgers (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT '账本ID',
    user_id         VARCHAR(36) NOT NULL COMMENT '所属用户ID',
    name            VARCHAR(50) NOT NULL COMMENT '账本名称',
    description     VARCHAR(200) DEFAULT NULL COMMENT '账本描述',
    emoji           VARCHAR(10) DEFAULT '📒' COMMENT '账本图标',
    color           VARCHAR(10) DEFAULT NULL COMMENT '账本颜色',
    is_default      TINYINT NOT NULL DEFAULT 0 COMMENT '是否默认账本: 0否, 1是',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted      TINYINT NOT NULL DEFAULT 0 COMMENT '软删除标记: 0未删除, 1已删除',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账本表';

-- ============================================
-- 8. 登录会话表 (sessions)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id              VARCHAR(36) PRIMARY KEY COMMENT '会话ID(UUID)',
    user_id         VARCHAR(36) NOT NULL COMMENT '用户ID',
    token           VARCHAR(255) NOT NULL COMMENT '会话Token',
    device_info     VARCHAR(200) DEFAULT NULL COMMENT '设备信息',
    ip_address      VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
    expires_at      DATETIME NOT NULL COMMENT '过期时间',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token(255)),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录会话表';

-- ============================================
-- 初始化系统默认分类数据
-- ============================================

-- 支出分类（系统默认）
INSERT INTO categories (type, name, emoji, color, is_system) VALUES
('expense', '餐饮', '🍜', '#FFB5BA', 1),
('expense', '交通', '🚗', '#B5DAFF', 1),
('expense', '购物', '🛒', '#FFE5B5', 1),
('expense', '居住', '🏠', '#C5E8D5', 1),
('expense', '娱乐', '🎮', '#E0B5FF', 1),
('expense', '医疗', '💊', '#B5F0FF', 1),
('expense', '通讯', '📱', '#B5E8FF', 1),
('expense', '教育', '📚', '#FFF5B5', 1),
('expense', '其他', '🍀', '#F0F0F0', 1);

-- 收入分类（系统默认）
INSERT INTO categories (type, name, emoji, color, is_system) VALUES
('income', '工资', '💰', '#A8E6CF', 1),
('income', '兼职', '💼', '#88C8FF', 1),
('income', '投资', '📈', '#D4A5FF', 1),
('income', '礼金', '🎁', '#FFB5C5', 1),
('income', '生意', '🏪', '#FFDAB5', 1),
('income', '其他', '💎', '#F0F0F0', 1);

-- ============================================
-- 初始化默认账户
-- ============================================
-- 注意：默认账户需要用户ID，这里先创建占位，用户创建时关联
-- 可通过触发器或存储过程在用户创建时自动添加
