// xử lý các API liên quan đến xác thực: đăng nhập, đăng ký, đăng xuất, lấy thông tin user
import axiosInstance from './axios';

export const authAPI = {
  // Đăng ký user mới
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      
      // ✅ Lưu token và user info (bao gồm created_at) vào localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đăng ký thất bại' };
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      // ✅ Lưu token và user info (bao gồm created_at) vào localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đăng nhập thất bại' };
    }
  },

  // ✅ MỚI - Lấy thông tin user từ server (refresh data)
  fetchCurrentUser: async () => {
    try {
      console.log('🔄 Fetching current user from API...');
      const response = await axiosInstance.get('/auth/me');
      
      console.log('📦 API Response:', response.data);
      
      // ✅ Backend trả về { user: {...} } nên phải lấy response.data.user
      const userData = response.data.user;
      
      if (!userData) {
        throw new Error('Không nhận được thông tin user từ API');
      }
      
      // Cập nhật localStorage với dữ liệu mới nhất
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ User data saved to localStorage:', userData);
      
      return userData;  // ✅ QUAN TRỌNG: Phải return userData
    } catch (error) {
      console.error('❌ Error fetching current user:', error);
      throw error.response?.data || { message: 'Không thể lấy thông tin user' };
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // ✅ MỚI - Cập nhật thông tin user
  updateProfile: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/auth/update/${userId}`, userData);
      
      // Cập nhật localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Cập nhật thất bại' };
    }
  },

  // ✅ MỚI - Đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Đổi mật khẩu thất bại' };
    }
  }
};

export default authAPI;