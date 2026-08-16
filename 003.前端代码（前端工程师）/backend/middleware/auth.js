const { pool } = require('../config/db');

// 验证用户登录状态的中间件
async function authMiddleware(req, res, next) {
    try {
        // 从请求头获取Token
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: '未授权访问，请先登录'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        // 验证Token
        const [sessions] = await pool.query(
            `SELECT s.user_id, s.expires_at, u.username, u.avatar
             FROM sessions s
             JOIN users u ON s.user_id = u.id
             WHERE s.token = ? AND s.expires_at > NOW()`,
            [token]
        );

        if (sessions.length === 0) {
            return res.status(401).json({
                success: false,
                message: '登录已过期，请重新登录'
            });
        }

        // 将用户信息附加到请求对象
        req.user = {
            userId: sessions[0].user_id,
            username: sessions[0].username,
            avatar: sessions[0].avatar
        };

        next();

    } catch (error) {
        console.error('认证中间件错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

module.exports = { authMiddleware };
