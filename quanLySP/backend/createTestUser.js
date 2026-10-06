// Chạy file này để tạo user test trong database
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function createTestUsers() {
  try {
    // Tạo user thường
    const userPassword = await bcrypt.hash('123456', 10);
    await db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      ['testuser1', userPassword, 'test@example.com', 'user']
    );
    console.log('✅ Tạo user thành công: testuser / 123456');

    // Tạo admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      ['admin', adminPassword, 'admin@example.com', 'admin']
    );
    console.log('✅ Tạo admin thành công: admin / admin123');

    console.log('\n🎉 Hoàn tất! Bạn có thể đăng nhập với:');
    console.log('   User: testuser1 / 654321');
    console.log('   Admin: admin / admin123');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️ User đã tồn tại trong database');
    } else {
      console.error('❌ Lỗi:', error.message);
    }
    process.exit(1);
  }
}

createTestUsers();