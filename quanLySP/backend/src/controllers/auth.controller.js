const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../config/jwt.config');

// Đăng ký user mới
exports.register = async (req, res) => {
  try {
    console.log('📝 Register request:', req.body);
    const { username, password, email } = req.body;

    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      console.log('⚠️ User already exists');
      return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔒 Password hashed');

    const [result] = await db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, 'user']
    );

    // ✅ LẤY THÔNG TIN USER VỪA TẠO BAO GỒM created_at
    const [newUser] = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    console.log('✅ User created:', result.insertId);
    
    // Tạo token
    const token = jwt.sign(
      { userId: newUser[0].id, username: newUser[0].username, role: newUser[0].role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
        role: newUser[0].role,
        created_at: newUser[0].created_at  // ✅ BỔ SUNG
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Đăng nhập thông thường
exports.login = async (req, res) => {
  try {
    console.log('🔐 Login request:', req.body);
    const { username, password } = req.body;

    // ✅ LẤY CẢ created_at TRONG QUERY
    const [users] = await db.query(
      'SELECT id, username, email, password, role, created_at FROM users WHERE username = ?',
      [username]
    );

    console.log('👤 Users found:', users.length);

    if (users.length === 0) {
      console.log('⚠️ User not found:', username);
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const user = users[0];
    console.log('✅ User found:', { id: user.id, username: user.username, role: user.role });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('⚠️ Invalid password for user:', username);
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', username);
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at  // ✅ BỔ SUNG
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Đăng nhập bằng PDF - FIXED VERSION
exports.loginWithPDF = async (req, res) => {
  try {
    console.log('📄 PDF Login request received');

    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được gửi lên.' });
    }

    console.log('🔎 File info:', {
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    const pdfParse = require('pdf-parse');
    const parsed = await pdfParse(req.file.buffer);
    const pdfText = parsed.text || '';

    console.log('📖 PDF parsed successfully, length:', pdfText.length);
    console.log('📜 PDF TEXT PREVIEW:\n', pdfText.substring(0, 300));

    // ✅ Tìm vị trí của "Token:" hoặc "AuthenticationToken:"
    const tokenKeywords = ['AuthenticationToken:', 'Token:', 'token:', 'TOKEN:'];
    let tokenStartIndex = -1;
    let foundKeyword = '';
    
    for (const keyword of tokenKeywords) {
      const index = pdfText.indexOf(keyword);
      if (index !== -1) {
        tokenStartIndex = index + keyword.length;
        foundKeyword = keyword;
        break;
      }
    }

    if (tokenStartIndex === -1) {
      console.warn('⚠️ Không tìm thấy từ khóa token trong PDF');
      return res.status(400).json({
        message: 'Không tìm thấy Authentication Token trong file PDF.',
        debugPreview: pdfText.substring(0, 500),
      });
    }

    console.log('🔎 Found keyword:', foundKeyword, 'at index:', tokenStartIndex);

    // ✅ Lấy phần text sau "Token:" và làm sạch
    const textAfterToken = pdfText.substring(tokenStartIndex);
    const cleanText = textAfterToken.replace(/\s+/g, '');
    console.log('🧹 Cleaned text after token:', cleanText.substring(0, 300));

    // ✅ Tìm tất cả các token có thể (lấy dài nhất có thể - tối đa 300 ký tự)
    const possibleToken = cleanText.substring(0, 300).match(/^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
    
    if (!possibleToken) {
      console.warn('⚠️ Không tìm thấy JWT token hợp lệ');
      return res.status(400).json({
        message: 'Không tìm thấy JWT token hợp lệ trong PDF.',
        debugPreview: cleanText.substring(0, 300),
      });
    }

    const longToken = possibleToken[0];
    console.log('🔍 Possible token found:', longToken);
    console.log('📏 Token length:', longToken.length);

    // ✅ Thử xác thực token - nếu fail thì thử cắt bớt từng ký tự từ cuối
    let token = null;
    let decoded = null;
    
    for (let trimLength = 0; trimLength <= 10; trimLength++) {
      const testToken = longToken.substring(0, longToken.length - trimLength);
      
      // Bỏ qua nếu không đủ 3 phần
      const parts = testToken.split('.');
      if (parts.length !== 3 || parts[2].length < 10) {
        continue;
      }
      
      try {
        console.log(`🧪 Testing token (trimmed ${trimLength} chars, length ${testToken.length})...`);
        decoded = jwt.verify(testToken, JWT_SECRET);
        token = testToken;
        console.log('✅ Token verified successfully!');
        break;
      } catch (verifyErr) {
        // Nếu token hết hạn, vẫn chấp nhận
        if (verifyErr.name === 'TokenExpiredError') {
          console.log('⏰ Token expired but valid structure');
          decoded = jwt.decode(testToken);
          token = testToken;
          break;
        }
        // Nếu là invalid signature, tiếp tục thử trim thêm
        if (verifyErr.message.includes('invalid signature')) {
          continue;
        }
        // Lỗi khác thì dừng
        break;
      }
    }

    if (!token || !decoded) {
      console.error('❌ Could not verify any token variant');
      return res.status(401).json({
        message: 'Token không hợp lệ hoặc bị hỏng.',
        debugInfo: 'Đã thử nhiều phiên bản token nhưng không thành công'
      });
    }

    console.log('✅ Final token:', token);
    console.log('📏 Final token length:', token.length);
    console.log('📋 Decoded:', decoded);

    // ✅ Lấy userId từ token (có thể là 'id' hoặc 'userId')
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Token không chứa thông tin user.' });
    }

    console.log('🔎 Looking for user with ID:', userId);

    // ✅ Tìm user trong DB - BỔ SUNG created_at
    const [rows] = await db.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?', 
      [userId]
    );
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const user = rows[0];
    console.log('✅ PDF Login successful for:', user.username);

    // ✅ Tạo token mới cho session (30 ngày)
    const newToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      message: 'Đăng nhập bằng PDF thành công.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at  // ✅ BỔ SUNG
      },
      token: newToken,
    });

  } catch (err) {
    console.error('❌ PDF Parse error:', err);
    return res.status(500).json({
      message: 'Lỗi xử lý file PDF.',
      error: err.message,
    });
  }
};

// ✅ Lấy thông tin user hiện tại - BỔ SUNG created_at
exports.getCurrentUser = async (req, res) => {
  try {
    console.log('📋 Getting current user, userId:', req.userId);
    
    const [users] = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [req.userId]
    );

    if (users.length === 0) {
      console.log('❌ User not found:', req.userId);
      return res.status(404).json({ message: 'User không tồn tại' });
    }

    console.log('✅ User found:', users[0]);
    res.json({
      user: users[0]
    });
  } catch (error) {
    console.error('❌ Error getting user:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};