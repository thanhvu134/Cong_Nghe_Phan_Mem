// xử lý bảo vệ route, chỉ cho phép truy cập nếu đã đăng nhập (và có thể yêu cầu quyền admin)
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated } = useAuth();

  // Chưa đăng nhập -> chuyển về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Route yêu cầu admin nhưng user không phải admin
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default ProtectedRoute;