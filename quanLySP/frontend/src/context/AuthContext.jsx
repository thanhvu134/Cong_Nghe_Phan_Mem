// AuthContext.jsx - Complete version with all features
import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthContext: Checking authentication...');
    
    const currentUser = authAPI.getCurrentUser();
    const isAuth = authAPI.isAuthenticated();
    
    console.log('👤 Current User:', currentUser);
    console.log('🔐 Is Authenticated:', isAuth);
    
    if (currentUser && isAuth) {
      setUserState(currentUser);
      setIsAuthenticated(true);
      console.log('✅ User is authenticated');
    } else {
      setIsAuthenticated(false);
      console.log('❌ User is NOT authenticated');
    }
    setLoading(false);
  }, []);

  // ✅ Hàm login
  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login...');
      const data = await authAPI.login(credentials);
      setUserState(data.user);
      setIsAuthenticated(true);
      console.log('✅ Login successful:', data.user);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Login failed:', error);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    }
  };

  // ✅ Hàm register
  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration...');
      const data = await authAPI.register(userData);
      console.log('✅ Registration successful');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Hàm logout
  const logout = () => {
    console.log('🚪 Logging out...');
    authAPI.logout();
    setUserState(null);
    setIsAuthenticated(false);
  };

  // ✅ Hàm cập nhật user (dùng trong Profile để refresh data)
  const setUser = (userData) => {
    console.log('🔄 Updating user data:', userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUserState(userData);
    } else {
      localStorage.removeItem('user');
      setUserState(null);
    }
  };

  // ✅ Hàm refresh user từ server
  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user data from server...');
      const userData = await authAPI.fetchCurrentUser();
      
      console.log('📦 Received user data:', userData);
      
      if (!userData) {
        throw new Error('Không nhận được dữ liệu user');
      }
      
      // Cập nhật state
      setUser(userData);
      console.log('✅ User data refreshed successfully:', userData);
      
      return userData;  // ✅ QUAN TRỌNG: Phải return userData
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
      // Nếu token hết hạn hoặc invalid, logout
      if (error.message?.includes('401') || error.message?.includes('token')) {
        logout();
      }
      throw error;
    }
  };

  const value = {
    user,
    setUser,           // ✅ Export setUser để Profile có thể dùng
    login,
    register,
    logout,
    refreshUser,       // ✅ Export refreshUser để refresh data từ server
    isAuthenticated,
    loading
  };

  // Hiển thị loading spinner khi đang check auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: '500' }}>
          Đang tải...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export default AuthContext;