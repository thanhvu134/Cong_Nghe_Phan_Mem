// App.jsx - Updated with ProductDetail and Profile route
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            {/* Trang Home là trang chủ - không cần đăng nhập */}
            <Route path="/" element={<Home />} />
            
            {/* Trang Login và Register - public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Trang Products - danh sách sản phẩm */}
            <Route path="/products" element={<Products />} />
            
            {/* Trang chi tiết sản phẩm */}
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* Trang Profile - thông tin tài khoản */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Trang Thống kê - chỉ dành cho admin */}
            <Route path="/statistics" element={<Statistics />} />
            
            {/* Redirect các route không tồn tại về Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;