import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FeaturedPosts from "../../components/featuredPosts/FeaturedPosts";
import Footer from "../../components/footer/Footer";
// import FeaturedPosts from "../../components/featuredPosts/FeaturedPosts";

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      {isHomePage && (
        <div className="featured-section">
          <FeaturedPosts />
        </div>
      )}
      {isHomePage && (
        <div className="footer-section">
          <Footer />
        </div>
      )}
    </div>
  );
}
function RequireAuth() {
  const { currentUser } = useContext(AuthContext);
  return !currentUser ? (
    <Navigate to="/login" />
  ) : (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
export { Layout, RequireAuth };
