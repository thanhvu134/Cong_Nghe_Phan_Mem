// ProductDetail.jsx - Trang chi tiết sản phẩm
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProductDetail();
  }, [id]);

  const loadProductDetail = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getProductById(id);
      setProduct(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < product.quantity) {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // Implement add to cart logic
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleEdit = () => {
    navigate(`/products`);
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productsAPI.deleteProduct(id);
        alert('Xóa sản phẩm thành công!');
        navigate('/products');
      } catch (err) {
        alert(err.message || 'Không thể xóa sản phẩm');
      }
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="detail-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="detail-error">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Có lỗi xảy ra</h2>
          <p className="error-text">{error}</p>
          <button onClick={() => navigate('/products')} className="back-button">
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Quay lại
        </button>

        <div className="detail-content">
          {/* Product Image Section */}
          <div className="detail-image-section">
            <div className="detail-image-container">
              {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="detail-image-icon" style="font-size: 12rem; opacity: 0.8;">🛍️</span>';
                  }}
                />
              ) : (
                <span className="detail-image-icon">🛍️</span>
              )}
            </div>
            <div className="detail-badge-container">
              {product.quantity > 0 ? (
                <div className="stock-badge in-stock">
                  ✓ Còn hàng
                </div>
              ) : (
                <div className="stock-badge out-of-stock">
                  ✕ Hết hàng
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="detail-info-section">
            <h1 className="detail-title">{product.name}</h1>
            
            <div className="detail-price-section">
              <span className="detail-price">
                {Number(product.price).toLocaleString('vi-VN')}₫
              </span>
              <span className="detail-stock">
                Còn lại: {product.quantity} sản phẩm
              </span>
            </div>

            <div className="detail-description">
              <h3 className="section-title">Mô tả sản phẩm</h3>
              <p className="description-text">
                {product.description || 'Không có mô tả chi tiết cho sản phẩm này.'}
              </p>
            </div>

            <div className="detail-features">
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span className="feature-text">Chất lượng cao</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">Giao hàng nhanh</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <span className="feature-text">Đổi trả dễ dàng</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💳</span>
                <span className="feature-text">Thanh toán an toàn</span>
              </div>
            </div>

            {/* Quantity Selector (for customers) */}
            {!isAdmin && product.quantity > 0 && (
              <div className="quantity-section">
                <h3 className="section-title">Số lượng</h3>
                <div className="quantity-control">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="quantity-btn"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="quantity-btn"
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="detail-actions">
              {isAdmin ? (
                <>
                  <button onClick={handleEdit} className="action-btn edit-btn">
                    <span className="btn-icon">✏️</span>
                    Chỉnh sửa
                  </button>
                  <button onClick={handleDelete} className="action-btn delete-btn">
                    <span className="btn-icon">🗑️</span>
                    Xóa sản phẩm
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="action-btn add-cart-btn"
                    disabled={product.quantity === 0}
                  >
                    <span className="btn-icon">🛒</span>
                    {product.quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                  </button>
                  <button className="action-btn buy-now-btn" disabled={product.quantity === 0}>
                    <span className="btn-icon">⚡</span>
                    Mua ngay
                  </button>
                </>
              )}
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <span className="info-label">Danh mục:</span>
                <span className="info-value">Sản phẩm chung</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mã sản phẩm:</span>
                <span className="info-value">SP-{product.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="product-specs">
          <h2 className="specs-title">Thông tin chi tiết</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <span className="spec-label">Giá bán</span>
              <span className="spec-value">
                {Number(product.price).toLocaleString('vi-VN')}₫
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Tình trạng</span>
              <span className="spec-value">
                {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Số lượng có sẵn</span>
              <span className="spec-value">{product.quantity} sản phẩm</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Bảo hành</span>
              <span className="spec-value">12 tháng</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;