import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// 建立 axios 實例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器 - 處理錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async ({ email, password, role }) => {
    const extractDomain = (addr) => {
      if (!addr || !addr.includes('@')) return null;
      return addr.split('@').pop().toLowerCase();
    };
    // 可在此擴充實際網域與客戶ID對應（後端版應從DB查）
    const domainToCustomerId = {
      'qztech.com.tw': 1,
      'innovasoft.com.tw': 2,
      'futuretech.com.tw': 3,
      'smart-solutions.com.tw': 4,
      // 範例測試網域
      'example1.com': 1,
      'example2.com': 2,
      'example3.com': 3,
      'example4.com': 4,
    };

    let resolvedCustomerId;
    if (role === 'customer') {
      const domain = extractDomain(email);
      resolvedCustomerId = domain ? domainToCustomerId[domain] : undefined;
      if (!resolvedCustomerId) {
        // 模擬後端錯誤
        await new Promise((r) => setTimeout(r, 200));
        throw { response: { data: '無法根據Email判定公司，請聯絡管理員' } };
      }
    }

    const user = {
      id: 'u-' + Math.random().toString(36).slice(2, 8),
      name: (role === 'admin' ? '管理員' : role === 'technician' ? '工程師' : '客戶') + '-' + (email || 'user'),
      email: email || `${role}@example.com`,
      role: role || 'customer',
      customerId: role === 'customer' ? resolvedCustomerId : undefined,
    };
    const token = 'mock-token-' + Date.now();
    await new Promise(r => setTimeout(r, 300));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { data: { user, token } };
  },
  logout: async () => {
    await new Promise(r => setTimeout(r, 200));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { data: null };
  },
  getCurrentUser: async () => {
    await new Promise(r => setTimeout(r, 150));
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    if (!token || !userRaw) throw new Error('未登入');
    const user = JSON.parse(userRaw);
    return { data: user };
  }
};
