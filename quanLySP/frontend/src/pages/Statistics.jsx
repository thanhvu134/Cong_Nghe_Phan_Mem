// Statistics.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
import { useNavigate } from 'react-router-dom';
import './Statistics.css';
import Footer from '../components/Footer';

const Statistics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    inStock: 0,
    outOfStock: 0,
    avgPrice: 0,
    products: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadStatistics();
  }, [user, navigate]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const products = await productsAPI.getAllProducts();
      
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const inStock = products.filter(p => p.quantity > 0).length;
      const outOfStock = products.filter(p => p.quantity === 0).length;
      const avgPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;

      setStats({
        totalProducts,
        totalValue,
        inStock,
        outOfStock,
        avgPrice,
        products: products.sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity)).slice(0, 5)
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="statistics-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      <div className="statistics-container">
        {/* Header */}
        <div className="statistics-header">
          <h1 className="statistics-title">📊 Thống Kê Sản Phẩm</h1>
          <p className="statistics-subtitle">Tổng quan về sản phẩm</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card stat-card-purple">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Tổng Sản Phẩm</div>
          </div>

          <div className="stat-card stat-card-blue">
            <div className="stat-icon">💰</div>
            <div className="stat-value">{stats.totalValue.toLocaleString('vi-VN')}₫</div>
            <div className="stat-label">Tổng Giá Trị Kho</div>
          </div>

          <div className="stat-card stat-card-green">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.inStock}</div>
            <div className="stat-label">Còn Hàng</div>
          </div>

          <div className="stat-card stat-card-red">
            <div className="stat-icon">❌</div>
            <div className="stat-value">{stats.outOfStock}</div>
            <div className="stat-label">Hết Hàng</div>
          </div>
        </div>

        {/* Average Price */}
        <div className="average-price-card">
          <div className="stat-icon">💎</div>
          <div className="average-label">Giá Trung Bình</div>
          <div className="average-value">{stats.avgPrice.toLocaleString('vi-VN')}₫</div>
        </div>

        {/* Top Products */}
        <div className="top-products-card">
          <h2 className="top-products-title">🏆 Top 5 Sản Phẩm Giá Trị Cao Nhất</h2>
          
          <div className="top-products-list">
            {stats.products.map((product, index) => (
              <div 
                key={product.id} 
                className="top-product-item"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="top-product-rank">{index + 1}</div>
                
                <div className="top-product-info">
                  <div className="top-product-name">{product.name}</div>
                  <div className="top-product-details">
                    Số lượng: {product.quantity} | Giá: {product.price.toLocaleString('vi-VN')}₫
                  </div>
                </div>
                
                <div className="top-product-value">
                  {(product.price * product.quantity).toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Statistics;