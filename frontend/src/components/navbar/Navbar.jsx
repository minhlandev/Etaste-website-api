import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  const location = useLocation();

  // Không hiển thị Navbar nếu đang ở trang AdminDashboard
  if (location.pathname === "/admin/dashboard") {
    return null;
  }

  if (currentUser) fetch();

  const isAboutOrContact = location.pathname === "/about" || location.pathname === "/contact";

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
        </a>
        <a href="/">Home</a>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/list">List</Link>
      </div>
      <div className={`right ${isAboutOrContact ? "no-bg" : ""}`}>
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
            
          </div>
        ) : (
          <>
            <a href="/login" className="login">
              <FaSignInAlt /> Sign in
            </a>
            <a href="/register" className="register">
              <FaUserPlus /> Sign up
            </a>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <Link to="/list" onClick={() => setOpen(false)}>List</Link>
          <a href="/login">
            <FaSignInAlt /> Sign in
          </a>
          <a href="/register">
            <FaUserPlus /> Sign up
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
