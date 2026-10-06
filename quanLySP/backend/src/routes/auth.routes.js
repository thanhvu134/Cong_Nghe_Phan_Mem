// auth.routes.js - Thêm route đăng nhập bằng PDF
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');

// Cấu hình multer để xử lý file upload (lưu trong memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF'));
    }
  }
});

// Đăng ký
router.post('/register', authController.register);

// Đăng nhập thông thường
router.post('/login', authController.login);

// Đăng nhập bằng PDF - MỚI
router.post('/login-pdf', upload.single('pdf'), authController.loginWithPDF);

// Lấy thông tin user hiện tại (cần xác thực)
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;