import "./footer.scss";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Về chúng tôi</h3>
          <p>
            Chúng tôi cung cấp nền tảng kết nối người thuê và người cho thuê nhà
            trọ, căn hộ một cách hiệu quả và tiện lợi.
          </p>
          <div className="social-links">
            <a
              href="https://www.facebook.com/tran.minh.lan.270103/"
              className="social-icon"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/mngbhh.oi/"
              className="social-icon"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/@lantranminh5616"
              className="social-icon"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/list">List</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Loại phòng</h3>
          <ul>
            <li>
              <Link to="/list?property=apartment">Căn hộ</Link>
            </li>
            <li>
              <Link to="/list?property=house">Nhà nguyên căn</Link>
            </li>
            <li>
              <Link to="/list?property=condo">Chung cư</Link>
            </li>
            <li>
              <Link to="/list?property=land">Đất nền</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Thông tin liên hệ</h3>
          <ul className="contact-info">
            <li>
              <MdLocationOn className="contact-icon location-icon" />
              <span>12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh</span>
            </li>
            <li>
              <MdPhone className="contact-icon" />
              <span>0862086571</span>
            </li>
            <li>
              <MdEmail className="contact-icon" />
              <span>minhlan.work@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 LHBP. FROJECT LTTHNC.</p>
      </div>
    </div>
  );
}

export default Footer;
