import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../../context/AuthContext";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Kiểm tra mật khẩu và mật khẩu xác nhận
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Gửi yêu cầu đăng ký
      // eslint-disable-next-line no-unused-vars
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError("");
    try {
      // Gửi token Google đến backend
      const res = await apiRequest.post("/auth/google-login", {
        token: credentialResponse.credential, // Token từ Google Identity Services
      });

      // Cập nhật thông tin người dùng
      updateUser(res.data);

      // Điều hướng đến trang chính
      navigate("/profile");
    } catch (err) {
      console.error("Google Login Error:", err.response || err);
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="972741886436-a3v53vu33nto94ch9kkhbl6ime94ja1c.apps.googleusercontent.com">
      <div className="registerPage">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h1>Create an Account</h1>

            <div className="inputGroup">
              <label htmlFor="username">
                <FaUser /> Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input id="email" name="email" type="text" placeholder="Email" />
            </div>

            <div className="inputGroup">
              <label htmlFor="password">
                <FaLock /> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="confirmPassword">
                <FaLock /> Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
              />
            </div>

            <button disabled={isLoading}>Register</button>
            <div className="googleLogin-btn">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </div>
            {error && <span>{error}</span>}
            <Link to="/login">Do you have an account?</Link>
          </form>
        </div>
        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Register;
