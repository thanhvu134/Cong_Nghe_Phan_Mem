import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <img src="/GB.svg" alt="Logo" className="brand-logo" />
          <span className="brand-text">Thanh Vũ</span>
        </Link>

        <div className="nav-center">
          <Link to="/" className="nav-link">
            Trang chủ
          </Link>
          <Link to="/products" className="nav-link">
            Sản phẩm
          </Link>
          {user?.role === 'admin' && (
            <Link to="/statistics" className="nav-link">
              Thống kê
            </Link>
          )}
        </div>

        <div className="nav-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <div 
                className="user-info"
                onClick={handleProfileClick}
                style={{ cursor: 'pointer' }}
                title="Xem thông tin tài khoản"
              >
                <div className="avatar">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="username">{user?.username}</span>
                  {user?.role === 'admin' && (
                    <span className="admin-badge">Admin</span>
                  )}
                </div>
              </div>
              
              <button onClick={handleLogout} className="logout-button">
                <span className="logout-icon">🚪</span>
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Đăng nhập
              </Link>
              <Link to="/register" className="register-button">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;