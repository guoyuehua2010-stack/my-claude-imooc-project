/**
 * 财务管家 - 路由导航模块
 * 简单的页面导航系统
 */

// 页面列表
const PAGES = {
    'login': 'pages/auth/login.html',
    'register': 'pages/auth/register.html',
    'home': 'pages/main/home.html',
    'add': 'pages/main/add.html',
    'bills': 'pages/main/bills.html',
    'profile': 'pages/main/profile.html'
};

// 当前页面
let currentPage = 'login';

// 简单的路由实现
function navigateTo(page) {
    if (!PAGES[page]) {
        console.error('Page not found:', page);
        return;
    }

    currentPage = page;

    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => {
        p.style.display = 'none';
    });

    // 显示目标页面
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('page-transition');
    }

    // 更新Tab导航状态
    updateTabNavigation(page);

    // 保存导航状态
    localStorage.setItem('currentPage', page);
}

// 更新Tab导航状态
function updateTabNavigation(page) {
    const tabMapping = {
        'home': 'home',
        'bills': 'bills',
        'profile': 'my'
    };

    const tabId = tabMapping[page] || page;

    document.querySelectorAll('.tab-item').forEach(tab => {
        if (tab.dataset.page === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// 初始化导航
function initNavigation() {
    // Tab栏导航点击
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
            const page = tab.dataset.page;
            if (page === 'my') {
                navigateTo('profile');
            } else {
                navigateTo(page);
            }
        });
    });

    // FAB按钮点击
    const fab = document.getElementById('fab-add');
    if (fab) {
        fab.addEventListener('click', () => {
            navigateTo('add');
        });
    }

    // 关闭按钮
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', () => {
            history.back();
            if (currentPage === 'add' || currentPage === 'bills') {
                navigateTo('home');
            }
        });
    });
}

// 检查登录状态
function checkAuth() {
    const session = localStorage.getItem('xiaoqianhe_session');
    if (session) {
        try {
            const data = JSON.parse(session);
            if (data.userId) {
                return true;
            }
        } catch (e) {
            return false;
        }
    }
    return false;
}

// 导出导航函数
window.navigateTo = navigateTo;
window.checkAuth = checkAuth;
window.initNavigation = initNavigation;
