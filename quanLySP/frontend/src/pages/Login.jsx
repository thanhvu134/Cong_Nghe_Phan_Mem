// Login.jsx - Thêm chức năng đăng nhập bằng PDF
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Đăng nhập thất bại');
    }
    setLoading(false);
  };

  // Xử lý upload PDF
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Vui lòng chọn file PDF!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('http://localhost:5000/api/auth/login-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Lưu token và user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Reload context và chuyển trang
        window.location.href = '/';
      } else {
        setError(data.message || 'Đăng nhập bằng PDF thất bại');
      }
    } catch (error) {
      console.error('PDF Login Error:', error);
      setError('Lỗi khi đăng nhập bằng PDF');
    } finally {
      setLoading(false);
      setPdfFile(null);
      e.target.value = '';
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Image & Logo */}
      <div className="login-left">
        <div className="login-overlay">
          <div className="logo-section">
            <div className="logo-circle">
              <img src="/GB.svg" alt="Logo" className="logo-img" />
            </div>
            <h1 className="logo-title">Thanh Vũ</h1>
            <p className="logo-tagline">
              Sản phẩm của sinh viên Kiến Trúc Đà Nẵng
            </p>
          </div>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span className="feature-text">Sản phẩm chất lượng cao</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <span className="feature-text">Giao hàng nhanh chóng</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💎</span>
              <span className="feature-text">Giá cả hợp lý nhất</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          {/* Logo ở phần form */}
          <div className="form-logo">
            <img src="/logoDAU1.png" alt="Logo" className="form-logo-img" />
          </div>

          <div className="form-header">
            <h2 className="form-title">Chào bạn! 👋</h2>
            <p className="form-subtitle">
              Đăng nhập để tiếp tục nhé!
            </p>
          </div>

          {error && (
            <div className="error-box">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Form đăng nhập thông thường */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">👤</span>
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Nhập tên đăng nhập của bạn"
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">🔒</span>
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">hoặc</span>
          </div>

          {/* Đăng nhập bằng PDF */}
          <div className="pdf-login-section">
            <label htmlFor="pdf-upload" className="pdf-upload-button">
              <span className="pdf-icon">📄</span>
              <span>Đăng nhập bằng PDF</span>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handlePDFUpload}
                disabled={loading}
                style={{ display: 'none' }}
              />
            </label>
            <p className="pdf-hint">
              Tải lên file PDF tài khoản của bạn
            </p>
          </div>

          <div className="form-footer">
            <p className="footer-text">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="footer-link">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;