const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// API路由
app.use('/api/users', userRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API接口不存在'
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误'
    });
});

// 启动服务器
async function startServer() {
    console.log('🚀 启动财务管家后端服务...');

    // 测试数据库连接
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.error('❌ 无法连接到数据库，请检查配置');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
        console.log(`📚 API文档:`);
        console.log(`   - POST /api/users/register - 用户注册`);
        console.log(`   - POST /api/users/login - 用户登录`);
        console.log(`   - POST /api/users/logout - 用户登出`);
        console.log(`   - GET  /api/users/verify - 验证Token`);
    });
}

startServer();
