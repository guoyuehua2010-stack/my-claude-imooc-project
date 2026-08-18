const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/db');

// 用户注册
async function register(req, res) {
    try {
        const { username, password } = req.body;

        // 参数验证
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '用户名和密码不能为空'
            });
        }

        // 用户名长度验证
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({
                success: false,
                message: '用户名长度必须在3-20个字符之间'
            });
        }

        // 密码长度验证
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '密码长度不能少于6位'
            });
        }

        // 检查用户名是否已存在
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: '用户名已存在'
            });
        }

        // 生成盐值并加密密码
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // 创建用户ID
        const userId = uuidv4();

        // 插入用户数据
        await pool.query(
            'INSERT INTO users (id, username, password, salt, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [userId, username, hashedPassword, salt]
        );

        // 为新用户创建默认账户
        const defaultAccounts = [
            { name: '现金', emoji: '💵' },
            { name: '微信', emoji: '💬' },
            { name: '支付宝', emoji: '💰' },
            { name: '银行卡', emoji: '💳' }
        ];

        for (const account of defaultAccounts) {
            await pool.query(
                'INSERT INTO accounts (user_id, name, emoji, balance, created_at, updated_at) VALUES (?, ?, ?, 0, NOW(), NOW())',
                [userId, account.name, account.emoji]
            );
        }

        // 生成会话Token
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7天后过期

        await pool.query(
            'INSERT INTO sessions (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, NOW())',
            [uuidv4(), userId, token, expiresAt]
        );

        res.status(201).json({
            success: true,
            message: '注册成功',
            data: {
                userId,
                username,
                token
            }
        });

    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

// 用户登录
async function login(req, res) {
    try {
        const { username, password } = req.body;

        // 参数验证
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: '用户名和密码不能为空'
            });
        }

        // 查找用户
        const [users] = await pool.query(
            'SELECT id, username, password, salt, status FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }

        const user = users[0];

        // 检查账号状态
        if (user.status !== 1) {
            return res.status(403).json({
                success: false,
                message: '账号已被禁用'
            });
        }

        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }

        // 删除旧会话
        await pool.query('DELETE FROM sessions WHERE user_id = ?', [user.id]);

        // 生成新会话Token
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7天后过期

        await pool.query(
            'INSERT INTO sessions (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, NOW())',
            [uuidv4(), user.id, token, expiresAt]
        );

        res.json({
            success: true,
            message: '登录成功',
            data: {
                userId: user.id,
                username: user.username,
                token
            }
        });

    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

// 用户登出
async function logout(req, res) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token不能为空'
            });
        }

        await pool.query('DELETE FROM sessions WHERE token = ?', [token]);

        res.json({
            success: true,
            message: '登出成功'
        });

    } catch (error) {
        console.error('登出错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

// 验证Token
async function verifyToken(req, res) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: '未提供Token'
            });
        }

        const [sessions] = await pool.query(
            `SELECT s.id, s.user_id, s.expires_at, u.username
             FROM sessions s
             JOIN users u ON s.user_id = u.id
             WHERE s.token = ? AND s.expires_at > NOW()`,
            [token]
        );

        if (sessions.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Token已过期或无效'
            });
        }

        res.json({
            success: true,
            data: {
                userId: sessions[0].user_id,
                username: sessions[0].username
            }
        });

    } catch (error) {
        console.error('验证Token错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

// 获取用户信息
async function getProfile(req, res) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: '未提供Token'
            });
        }

        const [sessions] = await pool.query(
            `SELECT s.user_id FROM sessions s WHERE s.token = ? AND s.expires_at > NOW()`,
            [token]
        );

        if (sessions.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Token已过期或无效'
            });
        }

        const userId = sessions[0].user_id;

        const [users] = await pool.query(
            'SELECT id, username, avatar, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: {
                userId: users[0].id,
                username: users[0].username,
                avatar: users[0].avatar,
                createdAt: users[0].created_at
            }
        });

    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    verifyToken,
    getProfile
};
