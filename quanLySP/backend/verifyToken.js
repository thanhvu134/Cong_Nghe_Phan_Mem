const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key_here'; // giống hệt trong auth.controller.js
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJ1c2VybmFtZSI6ImJpbmgxMjMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2MjQ5NDc5NSwiZXhwIjoxNzYyNTgxMTk1fQ.kkUHYHaTGa2cIrTV8lO-CgMb2huMWFPaeWE-Z4OLLMA';

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token hợp lệ:', decoded);
} catch (err) {
  console.error('❌ Token không hợp lệ:', err.message);
}
