import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { FaUser, FaLock } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      updateUser(res.data);

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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

      // Điều hướng đến trang Profile
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
      <div className="login">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h1>Welcome back</h1>

            <div className="inputGroup">
              <label htmlFor="username">
                <FaUser /> Username
              </label>
              <input
                id="username"
                name="username"
                required
                minLength={3}
                maxLength={20}
                type="text"
                placeholder="Username"
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="password">
                <FaLock /> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
              />
            </div>

            <button disabled={isLoading}>Login</button>
            <div className="googleLogin">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </div>
            {error && <span>{error}</span>}
            <Link to="/register">{"Don't"} you have an account?</Link>
          </form>
        </div>
        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
