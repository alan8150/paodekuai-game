import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 服务器地址（开发环境）
// 正式环境需要修改为实际服务器地址
const API_BASE_URL = 'http://192.168.1.100:3000/api';

// 创建axios实例
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            // 服务器返回错误状态
            const { status, data } = error.response;
            if (status === 401) {
                // token过期，清除本地存储
                AsyncStorage.removeItem('userToken');
                // 这里可以触发导航到登录页
            }
            return Promise.reject(data.message || '请求失败');
        } else if (error.request) {
            return Promise.reject('网络连接失败');
        } else {
            return Promise.reject(error.message);
        }
    }
);

// API接口
export const authAPI = {
    // 手机号注册
    registerByPhone: (phone, password, nickname) =>
        api.post('/auth/register/phone', { phone, password, nickname }),

    // 邮箱注册
    registerByEmail: (email, password, nickname) =>
        api.post('/auth/register/email', { email, password, nickname }),

    // 登录
    login: (account, password) =>
        api.post('/auth/login', { account, password }),

    // 获取当前用户信息
    getMe: () =>
        api.get('/auth/me'),
};

export default api;
