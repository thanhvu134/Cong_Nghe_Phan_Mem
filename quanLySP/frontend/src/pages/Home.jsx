// Home.jsx - Thêm nút xuất PDF
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { generateUserPDF } from '../utils/pdfGenerator';
import './Home.css';
import Footer from '../components/Footer';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Hàm xuất PDF
  const handleExportPDF = () => {
    if (user) {
      generateUserPDF(user);
    } else {
      alert('Vui lòng đăng nhập để xuất PDF!');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Đang tải sản phẩm...</p>
      </div>
    );
  }

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section với Banner */}
      <section className="hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              Khám Phá Với Bộ Sưu Tập <span className="highlight">Độc Đáo</span>
            </h1>
            <p className="hero-subtitle">
              Sản phẩm chất lượng cao từ sinh viên Kiến Trúc Đà Nẵng
            </p>
            <div className="hero-buttons">
              <button onClick={handleViewAllProducts} className="primary-button">
                <span>Xem Tất Cả Sản Phẩm</span>
                <span>→</span>
              </button>
              {isAdmin && (
                <button onClick={() => navigate('/products')} className="secondary-button">
                  <span>Quản Lý Sản Phẩm</span>
                </button>
              )}
              {/* NÚT XUẤT PDF */}
              {isAuthenticated && (
                <button onClick={handleExportPDF} className="secondary-button">
                  <span>📄 Xuất PDF Tài Khoản</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-box">
            <div className="feature-icon">✨</div>
            <h3 className="feature-title">Chất Lượng Cao</h3>
            <p className="feature-text">Sản phẩm được làm thủ công tỉ mỉ</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Giao Hàng Nhanh</h3>
            <p className="feature-text">Miễn phí ship cho đơn từ 500k</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">💎</div>
            <h3 className="feature-title">Giá Tốt Nhất</h3>
            <p className="feature-text">Cam kết giá rẻ nhất thị trường</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Thanh Toán An Toàn</h3>
            <p className="feature-text">Bảo mật thông tin tuyệt đối</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="section-header-center">
          <h2 className="section-title-center">🌟 Sản Phẩm Nổi Bật</h2>
          <p className="section-subtitle-center">
            Những sản phẩm được yêu thích nhất
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">Chưa có sản phẩm</h3>
            <p className="empty-text">
              {isAdmin ? 'Hãy thêm sản phẩm đầu tiên của bạn!' : 'Vui lòng quay lại sau!'}
            </p>
          </div>
        ) : (
          <>
            <div className="featured-products-grid">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="featured-product-card"
                  onClick={() => handleViewDetails(product.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="featured-product-image">
                    {product.image && product.image.trim() !== '' ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const icon = document.createElement('div');
                          icon.className = 'image-placeholder';
                          icon.innerHTML = '<span style="font-size: 4rem;">🛍️</span>';
                          e.target.parentElement.appendChild(icon);
                        }}
                      />
                    ) : (
                      <div className="image-placeholder">
                        <span style={{ fontSize: '4rem' }}>🛍️</span>
                      </div>
                    )}
                    <div className="product-overlay">
                      <button className="view-button">Xem Chi Tiết</button>
                    </div>
                    {product.quantity === 0 && (
                      <div className="sold-out-badge">Hết hàng</div>
                    )}
                  </div>
                  
                  <div className="featured-product-content">
                    <h3 className="featured-product-name">{product.name}</h3>
                    <p className="featured-product-description">
                      {product.description || 'Không có mô tả'}
                    </p>
                    <div className="featured-product-footer">
                      <span className="featured-product-price">
                        {Number(product.price).toLocaleString('vi-VN')}₫
                      </span>
                      <span className="featured-product-stock">
                        {product.quantity > 0 ? `Còn ${product.quantity}` : 'Hết hàng'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-all-container">
              <button onClick={handleViewAllProducts} className="view-all-button">
                Xem Tất Cả {products.length} Sản Phẩm
                <span>→</span>
              </button>
            </div>
          </>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="promo-overlay">
          <div className="promo-content">
            <div className="promo-badge">🎉 Ưu Đãi Đặc Biệt</div>
            <h2 className="promo-title">Giảm Giá Lên Đến 30%</h2>
            <p className="promo-text">
              Cho tất cả sản phẩm đến từ sinh viên Kiến Trúc Đà Nẵng
            </p>
            <button onClick={handleViewAllProducts} className="promo-button">
              Mua Ngay
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;