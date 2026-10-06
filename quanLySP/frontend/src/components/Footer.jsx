// xử lý footer của trang web
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🦚 Danh mục quản lý</h3>
          <p>Cập nhập thông tin các sản phẩm mới uy tín hàng đầu Việt Nam ♥️</p>
        </div>

        <div className="footer-section">
          <h4>Thông Tin Liên Hệ</h4>
          <ul>
            <li>📍 Địa chỉ: 123 Xô viết Nghệ Tĩnh, Hải châu, Đà Nẵng</li>
            <li>📞 Hotline: 0946 8** ***</li>
            <li>📧 Email: vu_2151220285@dau.edu.vn</li>
            <li>🕐 Giờ làm việc: 8:00 - 22:00 (Cả tuần)</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Chính Sách</h4>
          <ul>
            <li><a href="#policy">Chính sách bảo hành</a></li>
            <li><a href="#return">Chính sách đổi trả</a></li>
            <li><a href="#privacy">Chính sách bảo mật</a></li>
            <li><a href="#shipping">Chính sách vận chuyển</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Kết Nối Với Chúng Tôi</h4>
          <div className="social-links">
            <a href="#facebook" className="social-icon">📘 Facebook</a>
            <a href="#instagram" className="social-icon">📷 Instagram</a>
            <a href="#youtube" className="social-icon">📹 YouTube</a>
            <a href="#zalo" className="social-icon">💬 Zalo</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; Luôn Đồng Hành Cùng Bạn. Always With You.</p>
        <p>Designed with ❤️ by ThanhVu</p>
      </div>
    </footer>
  )
}

export default Footer