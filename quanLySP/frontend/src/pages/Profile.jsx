// Profile.jsx - Final synchronized version
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // ✅ Nếu đã có user trong context, dùng luôn
    if (user && user.username) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
      setIsLoadingUser(false);
      return;
    }

    // ✅ Gọi API để lấy thông tin user mới nhất từ server
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        console.log('🔄 Fetching user data...');
        
        const userData = await refreshUser();
        
        console.log('✅ Got user data:', userData);
        
        if (!userData || !userData.username) {
          throw new Error('Dữ liệu user không hợp lệ');
        }
        
        // Cập nhật form data
        setFormData(prev => ({
          ...prev,
          username: userData.username || '',
          email: userData.email || ''
        }));
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
        alert('Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại.');
        navigate('/login');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate, refreshUser, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    // Validate password change
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert('Mật khẩu mới không khớp!');
        return;
      }
      if (formData.newPassword.length < 6) {
        alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
        return;
      }
    }

    try {
      // TODO: Call API to update user profile
      console.log('Updating profile:', formData);
      alert('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Refresh user data after update
      await refreshUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      
      // day/month/year hour:minute:second
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      
      return date.toLocaleString('vi-VN', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Lỗi định dạng ngày';
    }
  };

  // Tính thời gian đã đăng ký (năm, tháng, ngày, giờ, phút, giây)
  const calculateTimeSinceRegistration = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    
    try {
      const registrationDate = new Date(dateString);
      if (isNaN(registrationDate.getTime())) return 'Ngày không hợp lệ';
      
      const now = new Date();
      const diffMs = now - registrationDate;
      
      // Tính toán các đơn vị thời gian
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);
      
      // Tính phần dư
      const remainingMonths = months % 12;
      const remainingDays = days % 30;
      const remainingHours = hours % 24;
      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;
      
      // Xây dựng chuỗi hiển thị với xuống dòng
      const parts = [];
      if (years > 0) parts.push(`${years} năm`);
      if (remainingMonths > 0) parts.push(`${remainingMonths} tháng`);
      if (remainingDays > 0) parts.push(`${remainingDays} ngày`);
      if (remainingHours > 0) parts.push(`${remainingHours} giờ`);
      if (remainingMinutes > 0) parts.push(`${remainingMinutes} phút`);
      if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} giây`);
      
      return parts.join('\n');
    } catch (error) {
      console.error('Error calculating time:', error);
      return 'Lỗi tính toán';
    }
  };

  if (!user || isLoadingUser) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1 className="profile-title">Thông Tin Tài Khoản</h1>
            <p className="profile-subtitle">
              Quản lý thông tin cá nhân của bạn
            </p>
          </div>
        </div>

        <div className="profile-content">
          {/* Account Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">👤</span>
                Thông Tin Cơ Bản
              </h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                >
                  <span>✏️</span>
                  Chỉnh sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSaveChanges} className="profile-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👤</span>
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Tên đăng nhập"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📧</span>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Email của bạn"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">👑</span>
                  Vai trò
                </label>
                <div className="role-badge-container">
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? '👑 Quản trị viên' : '👤 Người dùng'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📅</span>
                  Thời gian đăng ký
                </label>
                <input
                  type="text"
                  value={formatDate(user.created_at)}
                  disabled
                  className="form-input"
                />
              </div>

              {isEditing && (
                <div className="password-section">
                  <h3 className="section-title">
                    <span className="section-icon">🔒</span>
                    Đổi Mật Khẩu (Tùy chọn)
                  </h3>

                  <div className="form-group">
                    <label className="form-label">Mật khẩu hiện tại</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="password-toggle"
                      >
                        {showPassword.current ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mật khẩu mới</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="password-toggle"
                      >
                        {showPassword.new ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Xác nhận mật khẩu mới</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="password-toggle"
                      >
                        {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    <span>💾</span>
                    Lưu thay đổi
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="cancel-button"
                  >
                    <span>❌</span>
                    Hủy
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Stats Card */}
          <div className="profile-card stats-card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">📊</span>
                Thống Kê Tài Khoản
              </h2>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">⏱️</div>
                <div className="stat-details">
                  <span className="stat-value">
                    {calculateTimeSinceRegistration(user.created_at)}
                  </span>
                  <span className="stat-label">Thời gian thành viên</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">🛒</div>
                <div className="stat-details">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Đơn hàng</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-details">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Đánh giá</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">❤️</div>
                <div className="stat-details">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Yêu thích</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;