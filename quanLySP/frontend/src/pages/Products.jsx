// Products.jsx - Clean Version with Image URL Support + Search & Filter
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
import './Products.css';
import Footer from '../components/Footer';

const Products = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: ''
  });

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAllProducts();
      console.log('Loaded products:', data);
      setProducts(data);
      setError('');
    } catch (err) {
      console.error('Load error:', err);
      setError(err.message || 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', quantity: '', image: '' });
    setShowForm(true);
  };

  const handleEdit = (e, product) => {
    e.stopPropagation();
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      image: product.image || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form Data:', formData);
    
    if (!formData.name || !formData.name.trim()) {
      alert('Vui lòng nhập tên sản phẩm');
      return;
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      alert('Vui lòng nhập giá hợp lệ');
      return;
    }
    
    if (formData.quantity === '' || Number(formData.quantity) < 0) {
      alert('Vui lòng nhập số lượng hợp lệ');
      return;
    }
    
    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description ? formData.description.trim() : '',
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        image: formData.image.trim() || ''
      };
      
      console.log('Submitting data:', submitData);

      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct.id, submitData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await productsAPI.createProduct(submitData);
        alert('Thêm sản phẩm thành công!');
      }
      
      setShowForm(false);
      setFormData({ name: '', description: '', price: '', quantity: '', image: '' });
      await loadProducts();
    } catch (err) {
      console.error('Submit error:', err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productsAPI.deleteProduct(id);
        alert('Xóa sản phẩm thành công!');
        loadProducts();
      } catch (err) {
        alert(err.message || 'Không thể xóa sản phẩm');
      }
    }
  };

  const handleViewDetails = (e, productId) => {
    e.stopPropagation();
    window.location.href = `/products/${productId}`;
  };

  // Filter and Search Logic
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        (product.description && product.description.toLowerCase().includes(search))
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = Number(product.price);
        switch(priceRange) {
          case 'under-100k': return price < 100000;
          case '100k-500k': return price >= 100000 && price < 500000;
          case '500k-1m': return price >= 500000 && price < 1000000;
          case 'over-1m': return price >= 1000000;
          default: return true;
        }
      });
    }

    // Stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (stockFilter === 'in-stock') return product.quantity > 0;
        if (stockFilter === 'out-of-stock') return product.quantity === 0;
        if (stockFilter === 'low-stock') return product.quantity > 0 && product.quantity <= 10;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name, 'vi');
        case 'name-desc': return b.name.localeCompare(a.name, 'vi');
        case 'price-asc': return Number(a.price) - Number(b.price);
        case 'price-desc': return Number(b.price) - Number(a.price);
        case 'quantity-asc': return a.quantity - b.quantity;
        case 'quantity-desc': return b.quantity - a.quantity;
        default: return 0;
      }
    });

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange('all');
    setStockFilter('all');
    setSortBy('name-asc');
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <div className="header-content">
            <h1>Quản Lý Sản Phẩm</h1>
            <p>{filteredProducts.length} / {products.length} sản phẩm</p>
          </div>
          {isAdmin && (
            <button onClick={handleAddNew} className="add-product-btn">
              <span className="add-icon">+</span>
              Thêm Sản Phẩm
            </button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="filter-section">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="clear-search-btn"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">💰 Khoảng giá:</label>
              <select 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả</option>
                <option value="under-100k">Dưới 100k</option>
                <option value="100k-500k">100k - 500k</option>
                <option value="500k-1m">500k - 1 triệu</option>
                <option value="over-1m">Trên 1 triệu</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">📦 Tình trạng:</label>
              <select 
                value={stockFilter} 
                onChange={(e) => setStockFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả</option>
                <option value="in-stock">Còn hàng</option>
                <option value="low-stock">Sắp hết (≤10)</option>
                <option value="out-of-stock">Hết hàng</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">🔄 Sắp xếp:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="quantity-asc">Tồn kho tăng dần</option>
                <option value="quantity-desc">Tồn kho giảm dần</option>
              </select>
            </div>

            {(searchTerm || priceRange !== 'all' || stockFilter !== 'all' || sortBy !== 'name-asc') && (
              <button 
                onClick={clearFilters}
                className="clear-filters-btn"
                title="Xóa tất cả bộ lọc"
              >
                🔄 Đặt lại
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {filteredProducts.length === 0 ? (
          <div className="empty-products">
            <div className="empty-icon">
              {searchTerm || priceRange !== 'all' || stockFilter !== 'all' ? '🔍' : '📦'}
            </div>
            <h3 className="empty-title">
              {searchTerm || priceRange !== 'all' || stockFilter !== 'all' 
                ? 'Không tìm thấy sản phẩm' 
                : 'Chưa có sản phẩm'}
            </h3>
            <p className="empty-text">
              {searchTerm || priceRange !== 'all' || stockFilter !== 'all'
                ? 'Thử điều chỉnh bộ lọc hoặc tìm kiếm khác'
                : (isAdmin ? 'Hãy thêm sản phẩm đầu tiên của bạn!' : 'Vui lòng quay lại sau!')}
            </p>
            {(searchTerm || priceRange !== 'all' || stockFilter !== 'all') && (
              <button onClick={clearFilters} className="clear-filters-btn" style={{marginTop: '1rem'}}>
                🔄 Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={(e) => handleViewDetails(e, product.id)}
              >
                <div className="product-image-container">
                  {product.image && product.image.trim() !== '' ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.log('Image load error:', product.id);
                        e.target.style.display = 'none';
                        const icon = document.createElement('span');
                        icon.className = 'product-image-icon';
                        icon.textContent = '🛍️';
                        e.target.parentElement.appendChild(icon);
                      }}
                      onLoad={() => {
                        console.log('Image loaded:', product.id);
                      }}
                    />
                  ) : (
                    <span className="product-image-icon">🛍️</span>
                  )}
                  <div className="product-badge">
                    {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">
                    {product.description || 'Không có mô tả'}
                  </p>

                  <div className="product-footer">
                    <div className="product-price-info">
                      <span className="product-price">
                        {Number(product.price).toLocaleString('vi-VN')}₫
                      </span>
                      <span className="product-quantity">
                        Còn {product.quantity} sản phẩm
                      </span>
                    </div>

                    {isAdmin ? (
                      <div className="admin-actions">
                        <button
                          onClick={(e) => handleEdit(e, product)}
                          className="action-btn edit-action-btn"
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleViewDetails(e, product.id)}
                        className="view-details-btn"
                      >
                        Chi Tiết
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="products-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="products-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="products-modal-header">
              <h2 className="products-modal-title">
                {editingProduct ? '✏️ Chỉnh Sửa Sản Phẩm' : '➕ Thêm Sản Phẩm Mới'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="products-form">
              {/* Image URL Input */}
              <div className="form-field">
                <label className="field-label">🖼️ URL Hình ảnh (từ internet)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="https://example.com/image.jpg"
                />
                <small style={{ 
                  color: '#718096', 
                  fontSize: '0.85rem', 
                  marginTop: '0.5rem', 
                  display: 'block' 
                }}>
                  💡 Hướng dẫn: Nhấp chuột phải vào ảnh trên mạng → "Copy image address" → Dán vào đây
                </small>
                
                {/* Image Preview */}
                {formData.image && formData.image.trim() !== '' && (
                  <div style={{ 
                    marginTop: '1rem', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    border: '2px solid #e2e8f0',
                    backgroundColor: '#f7fafc'
                  }}>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.style.cssText = 'padding: 2rem; text-align: center; color: #ef4444; font-weight: 600;';
                        errorDiv.innerHTML = '❌ URL ảnh không hợp lệ hoặc không thể tải';
                        e.target.parentElement.appendChild(errorDiv);
                      }}
                      onLoad={(e) => {
                        console.log('Preview image loaded successfully');
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-field">
                <label className="field-label">Tên sản phẩm *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="field-input"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="field-textarea"
                  placeholder="Mô tả chi tiết về sản phẩm"
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Giá (VNĐ) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="field-input"
                    placeholder="0"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Số lượng *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="field-input"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', description: '', price: '', quantity: '', image: '' });
                  }}
                  className="form-cancel-btn"
                >
                  Hủy
                </button>
                <button type="submit" className="form-submit-btn">
                  {editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Products;