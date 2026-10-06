const db = require('./config/db');

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    console.log('Database connected successfully!');
    console.log('Users in database:', rows);
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();