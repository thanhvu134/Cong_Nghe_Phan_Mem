// api/products.js - Products API with getProductById
const API_URL = 'http://localhost:5000/api';

console.log('🔧 API_URL configured:', API_URL);

// Lấy token từ localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Tạo headers với token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const productsAPI = {
  // Lấy tất cả sản phẩm (PUBLIC - không cần token)
  getAllProducts: async () => {
    try {
      const url = `${API_URL}/products`;
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP ${response.status}: Không thể tải danh sách sản phẩm`);
      }

      const data = await response.json();
      console.log('✅ Data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      console.error('❌ Error details:', error.message);
      throw error;
    }
  },

  // Lấy chi tiết một sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'GET',
        headers: getAuthHeaders() // Gửi token nếu có
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Không tìm thấy sản phẩm');
        }
        throw new Error('Không thể tải thông tin sản phẩm');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Tạo sản phẩm mới (chỉ admin)
  createProduct: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể tạo sản phẩm');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Cập nhật sản phẩm (chỉ admin)
  updateProduct: async (id, productData) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể cập nhật sản phẩm');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Xóa sản phẩm (chỉ admin)
  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể xóa sản phẩm');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};