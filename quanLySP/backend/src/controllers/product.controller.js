const db = require('../config/db');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    
    // Log để debug
    console.log('📦 Returning', products.length, 'products');
    products.forEach(p => {
      console.log(`  - Product ${p.id}: "${p.name}", image: "${p.image}"`);
    });
    
    res.json(products);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, image } = req.body;

    console.log('📝 Received data:', req.body);

    // Validate
    if (!name || !price) {
      return res.status(400).json({ message: 'Tên và giá sản phẩm là bắt buộc' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)',
      [name, description || '', price, quantity || 0, image || null]
    );

    res.status(201).json({
      message: 'Thêm sản phẩm thành công',
      productId: result.insertId
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, image } = req.body;

    console.log('📝 Updating product:', id, 'with data:', req.body);

    // Validate
    if (!name || !price) {
      return res.status(400).json({ message: 'Tên và giá sản phẩm là bắt buộc' });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const [existingProducts] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Update với image
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image = ? WHERE id = ?',
      [name, description || '', price, quantity || 0, image || null, id]
    );

    res.json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra sản phẩm có tồn tại không
    const [existingProducts] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (existingProducts.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};