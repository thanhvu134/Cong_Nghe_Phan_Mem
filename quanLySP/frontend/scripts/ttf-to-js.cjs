// scripts/ttf-to-js.js
const fs = require('fs');
const path = require('path');

// ====== Cấu hình ======
const ttfFile = path.join(__dirname, '../src/utils/fonts/roboto-regular.ttf'); // đường dẫn tới TTF của bạn
const outFile = path.join(__dirname, '../src/utils/fonts/roboto-regular.js'); // file JS sẽ được tạo
const exportName = 'default'; // chúng ta sẽ export default base64 string
// =======================

if (!fs.existsSync(ttfFile)) {
  console.error('Không tìm thấy ttf file:', ttfFile);
  process.exit(1);
}

const ttfBuffer = fs.readFileSync(ttfFile);
const base64 = ttfBuffer.toString('base64');

// Ghi file JS dạng: export default 'BASE64...';
const fileContent = `// Auto-generated from ${path.basename(ttfFile)}\nexport default '${base64}';\n`;

fs.writeFileSync(outFile, fileContent, { encoding: 'utf8' });
console.log('Đã tạo file:', outFile);
console.log('Kích thước base64 (kb):', Math.round(base64.length / 1024));
