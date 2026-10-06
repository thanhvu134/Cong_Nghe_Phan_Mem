// xử lý các route liên quan đến sản phẩm: lấy danh sách, thêm, sửa, xóa
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware: chỉ admin mới có quyền thêm/sửa/xóa
const adminOnly = (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới có quyền thực hiện thao tác này' });
  }
  next();
};

// PUBLIC ROUTES - Không cần đăng nhập
// Lấy tất cả sản phẩm (public)
router.get('/', productController.getAllProducts);

// Lấy sản phẩm theo ID (public)
router.get('/:id', productController.getProductById);

// PROTECTED ROUTES - Chỉ admin
// Thêm sản phẩm mới (chỉ admin)
router.post('/', authMiddleware, adminOnly, productController.createProduct);

// Cập nhật sản phẩm (chỉ admin)
router.put('/:id', authMiddleware, adminOnly, productController.updateProduct);

// Xóa sản phẩm (chỉ admin)
router.delete('/:id', authMiddleware, adminOnly, productController.deleteProduct);

module.exports = router;