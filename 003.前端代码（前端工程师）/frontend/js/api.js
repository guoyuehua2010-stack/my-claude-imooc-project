// API 配置
const API_BASE_URL = 'http://localhost:3000/api';

// API 请求封装
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // 如果有Token，添加到请求头
    const token = localStorage.getItem('xiaoqianhe_token');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API请求错误:', error);
        return {
            success: false,
            message: '网络连接失败，请检查服务器是否运行'
        };
    }
}

// 用户相关 API
const userAPI = {
    // 注册
    register: (username, password) => {
        return apiRequest('/users/register', 'POST', { username, password });
    },

    // 登录
    login: (username, password) => {
        return apiRequest('/users/login', 'POST', { username, password });
    },

    // 登出
    logout: () => {
        const token = localStorage.getItem('xiaoqianhe_token');
        return apiRequest('/users/logout', 'POST', { token });
    },

    // 验证Token
    verify: () => {
        return apiRequest('/users/verify');
    },

    // 获取用户信息
    getProfile: () => {
        return apiRequest('/users/profile');
    }
};

// 会话管理
const sessionManager = {
    // 保存会话
    saveSession: (data) => {
        localStorage.setItem('xiaoqianhe_userId', data.userId);
        localStorage.setItem('xiaoqianhe_username', data.username);
        localStorage.setItem('xiaoqianhe_token', data.token);
    },

    // 获取会话
    getSession: () => {
        return {
            userId: localStorage.getItem('xiaoqianhe_userId'),
            username: localStorage.getItem('xiaoqianhe_username'),
            token: localStorage.getItem('xiaoqianhe_token')
        };
    },

    // 清除会话
    clearSession: () => {
        localStorage.removeItem('xiaoqianhe_userId');
        localStorage.removeItem('xiaoqianhe_username');
        localStorage.removeItem('xiaoqianhe_token');
    },

    // 检查是否已登录
    isLoggedIn: () => {
        const token = localStorage.getItem('xiaoqianhe_token');
        return !!token;
    }
};

// 导出
window.API_BASE_URL = API_BASE_URL;
window.apiRequest = apiRequest;
window.userAPI = userAPI;
window.sessionManager = sessionManager;
