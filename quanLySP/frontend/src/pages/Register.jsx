// Register.jsx - Modern Register with split screen
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      setError(result.error || 'Đăng ký thất bại');
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      {/* Left Side - Image & Logo */}
      <div className="register-left">
        <div className="register-overlay">
          <div className="logo-section">
            <div className="logo-circle">
              <img src="/GB.svg" alt="Logo" className="logo-img" />
            </div>
            <h1 className="logo-title">Tham Gia cùng Tôi</h1>
            <p className="logo-tagline">
              Sản phẩm của sinh viên Kiến Trúc Đà Nẵng
            </p>
          </div>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">🎁</span>
              <div className="benefit-content">
                <h3 className="benefit-title">Ưu đãi đặc biệt</h3>
                <p className="benefit-text">Giảm giá 20% cho đơn hàng đầu tiên</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">⭐</span>
              <div className="benefit-content">
                <h3 className="benefit-title">Tích điểm thưởng</h3>
                <p className="benefit-text">Mỗi đơn hàng đều được tích điểm</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🚚</span>
              <div className="benefit-content">
                <h3 className="benefit-title">Miễn phí vận chuyển</h3>
                <p className="benefit-text">Cho đơn hàng trên 500.000đ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="register-right">
        <div className="register-form-container">
          {/* Logo ở phần form */}
          <div className="form-logo">
            <img src="/logoDAU1.png" alt="Logo" className="form-logo-img" />
          </div>
          <div className="form-header">
            <h2 className="form-title">Tạo tài khoản mới ✨</h2>
            <p className="form-subtitle">
              Điền thông tin để bắt đầu mua sắm
            </p>
          </div>

          {error && (
            <div className="error-box">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
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
                placeholder="Chọn tên đăng nhập của bạn"
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">📧</span>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="email@example.com"
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
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">✅</span>
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Nhập lại mật khẩu"
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
                  Đang xử lý...
                </>
              ) : (
                <>
                  <span>Đăng ký ngay</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">hoặc</span>
          </div>

          <div className="form-footer">
            <p className="footer-text">
              Đã có tài khoản?{' '}
              <Link to="/login" className="footer-link">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;