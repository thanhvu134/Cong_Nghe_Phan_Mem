// xử lý kết nối database MySQL
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'hbstudent', 
  password: '8203', 
  database: 'product_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;