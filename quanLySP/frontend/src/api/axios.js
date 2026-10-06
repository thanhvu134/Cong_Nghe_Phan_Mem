// axios.js - CẤU HÌNH ĐÚNG: Không redirect tự động cho trang public
import axios from 'axios';

// Lấy từ .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// ⭐ REQUEST INTERCEPTOR - Tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ⭐ RESPONSE INTERCEPTOR - Xử lý response và lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // QUAN TRỌNG: Chỉ xử lý lỗi 401 cho các endpoint CẦN authentication
    // KHÔNG redirect tự động để tránh ảnh hưởng tới các trang public
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized - Token invalid or expired');
      
      // Xóa token không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // KHÔNG tự động redirect!
      // Để component tự xử lý (ví dụ: hiển thị thông báo, redirect có chọn lọc)
      // Nếu cần redirect, hãy làm trong component cụ thể, không phải ở đây
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;