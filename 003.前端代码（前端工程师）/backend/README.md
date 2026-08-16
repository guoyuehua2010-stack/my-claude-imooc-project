# 财务管家 - 后端 API 服务

## 简介

使用 Node.js + Express 构建的后端 API 服务，提供用户认证（注册、登录、登出）功能。

## 技术栈

- **运行环境**: Node.js
- **Web框架**: Express.js
- **数据库**: MySQL 9.7.0
- **密码加密**: bcryptjs
- **数据库连接**: mysql2

## 目录结构

```
backend/
├── config/
│   └── db.js              # 数据库配置
├── controllers/
│   └── userController.js  # 用户控制器
├── middleware/
│   └── auth.js            # 认证中间件
├── routes/
│   └── user.js            # 用户路由
├── server.js              # 服务器入口
├── package.json           # 项目配置
└── README.md              # 说明文档
```

## 安装与运行

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置数据库

确保 MySQL 已启动并创建了 `financial_manager` 数据库：

```bash
# 执行数据库脚本
docker exec -i mysql mysql -uroot -proot --default-character-set=utf8mb4 < ../004.数据库脚本（数据库管理员DBA）/schema.sql
```

### 3. 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务启动后运行在 `http://localhost:3000`

## API 接口

### 用户注册

```
POST /api/users/register
Content-Type: application/json

{
    "username": "testuser",
    "password": "123456"
}

Response:
{
    "success": true,
    "message": "注册成功",
    "data": {
        "userId": "uuid",
        "username": "testuser",
        "token": "session-token"
    }
}
```

### 用户登录

```
POST /api/users/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "123456"
}

Response:
{
    "success": true,
    "message": "登录成功",
    "data": {
        "userId": "uuid",
        "username": "testuser",
        "token": "session-token"
    }
}
```

### 用户登出

```
POST /api/users/logout
Content-Type: application/json

{
    "token": "session-token"
}

Response:
{
    "success": true,
    "message": "登出成功"
}
```

### 验证Token

```
GET /api/users/verify
Authorization: Bearer <token>

Response:
{
    "success": true,
    "data": {
        "userId": "uuid",
        "username": "testuser"
    }
}
```

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| DB_HOST | localhost | 数据库主机 |
| DB_PORT | 3306 | 数据库端口 |
| DB_USER | root | 数据库用户名 |
| DB_PASSWORD | root | 数据库密码 |
| DB_NAME | financial_manager | 数据库名称 |
| PORT | 3000 | 服务器端口 |

## 注意事项

1. 所有密码使用 bcrypt 加密存储
2. Session Token 7天过期
3. 数据库连接使用 utf8mb4 编码，支持 emoji
