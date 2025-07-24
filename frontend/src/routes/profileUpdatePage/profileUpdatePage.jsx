import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { FaEnvelope, FaLock, FaUserEdit, FaSave } from "react-icons/fa"; // Import icons
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]); // Chỉ giữ state cho avatar
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, currentPassword, newPassword, confirmPassword } = Object.fromEntries(formData);

    // Kiểm tra nếu người dùng muốn thay đổi mật khẩu
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        toast.error("Current password is required to change your password.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("New password and confirmation do not match.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        email: email || currentUser.email,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        avatar: avatar[0] || currentUser.avatar,
      });

      updateUser(res.data);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => navigate("/profile"), 3000);
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "An error occurred.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>
            <FaUserEdit /> Update Profile
          </h1>
          <div className="item">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="currentPassword">
              <FaLock /> Current Password
            </label>
            <input id="currentPassword" name="currentPassword" type="password" />
          </div>
          <div className="item">
            <label htmlFor="newPassword">
              <FaLock /> New Password
            </label>
            <input id="newPassword" name="newPassword" type="password" />
          </div>
          <div className="item">
            <label htmlFor="confirmPassword">
              <FaLock /> Confirm New Password
            </label>
            <input id="confirmPassword" name="confirmPassword" type="password" />
          </div>
          <button>
            <FaSave /> Update {/* Thêm icon vào nút */}
          </button>
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
          alt="User Avatar"
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "tranminhlan",
            uploadPreset: "minhlan",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
    </div>
  );
}

export default ProfileUpdatePage;
