import jsPDF from 'jspdf';
import 'jspdf-autotable';
import robotoFont from './fonts/roboto-regular.js'; // 👈 import file vừa tạo

export const generateUserPDF = (user) => {
  const doc = new jsPDF();

  // ✅ Nạp font Unicode tiếng Việt
  doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto');

  // ✅ Viết tiếng Việt có dấu thoải mái
  doc.setFontSize(20);
  doc.text('THÔNG TIN TÀI KHOẢN', 105, 20, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  doc.setFontSize(12);
  doc.text('Username:', 30, 40);
  doc.text(user.username || '', 80, 40);
  doc.text('Email:', 30, 50);
  doc.text(user.email || '', 80, 50);
  doc.text('Role:', 30, 60);
  doc.text(user.role || '', 80, 60);
  doc.text('User ID:', 30, 70);
  doc.text(String(user.id || ''), 80, 70);

  // Token
  doc.setFontSize(10);
  doc.text('Authentication Token:', 30, 85);
  doc.setFontSize(8);
  const token = localStorage.getItem('token') || '';
  const splitToken = doc.splitTextToSize(token, 150);
  doc.text(splitToken, 30, 92);

  doc.setFontSize(10);
  doc.setTextColor(255, 0, 0);
  doc.text('LƯU Ý: Giữ file PDF này an toàn. Không chia sẻ với người khác!', 105, 280, { align: 'center' });

  // ✅ Xuất file
  doc.save(`${user.username}_account.pdf`);
};