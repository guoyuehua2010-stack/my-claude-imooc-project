const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// 用户注册
router.post('/register', userController.register);

// 用户登录
router.post('/login', userController.login);

// 用户登出
router.post('/logout', userController.logout);

// 验证Token
router.get('/verify', userController.verifyToken);

module.exports = router;
