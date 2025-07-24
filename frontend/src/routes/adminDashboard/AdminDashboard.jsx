/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import "./adminDashboard.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { FaSignOutAlt } from "react-icons/fa"; // Import icon Logout
import { useNavigate } from "react-router-dom"; // Import hook điều hướng

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const { currentUser } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER", // Giá trị mặc định
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const [statistics, setStatistics] = useState({
    users: [],
    posts: [],
    messages: [],
  });

  const navigate = useNavigate(); // Hook điều hướng

  const handleLogout = () => {
    // Xử lý logic thoát (nếu cần, ví dụ xóa token)
    // localStorage.removeItem("token"); // Nếu bạn lưu token trong localStorage

    // Chuyển hướng về trang Profile
    navigate("/profile");
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const usersRes = await apiRequest.get("/admin/statistics/users");
        const postsRes = await apiRequest.get("/admin/statistics/posts");
        const messagesRes = await apiRequest.get("/admin/statistics/messages");

        setStatistics({
          users: usersRes.data,
          posts: postsRes.data,
          messages: messagesRes.data,
        });
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
      }
    };

    fetchStatistics();
  }, []);

  const labels = ["6 Days Ago", "5 Days Ago", "4 Days Ago", "3 Days Ago", "2 Days Ago", "Yesterday", "Today"];

  // Dữ liệu biểu đồ cột (Users)
  const userChartData = {
    labels,
    datasets: [
      {
        label: "New Users",
        data: statistics.users,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Dữ liệu biểu đồ đường (Messages)
  const messageChartData = {
    labels,
    datasets: [
      {
        label: "Messages",
        data: statistics.messages,
        borderColor: "rgba(255, 159, 64, 0.6)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: true,
      },
    ],
  };

  // Dữ liệu biểu đồ tròn (Posts)
  const postChartData = {
    labels: ["6 Days Ago", "5 Days Ago", "4 Days Ago", "3 Days Ago", "2 Days Ago", "Yesterday", "Today"],
    datasets: [
      {
        label: "Posts",
        data: statistics.posts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
      },
    ],
  };

  // Dữ liệu biểu đồ tròn tổng hợp (Users, Posts, Messages)
  const combinedChartData = {
    labels: ["Users", "Posts", "Messages"],
    datasets: [
      {
        label: "Combined Data",
        data: [
          statistics.users.reduce((a, b) => a + b, 0), // Tổng số user trong 7 ngày
          statistics.posts.reduce((a, b) => a + b, 0), // Tổng số bài post trong 7 ngày
          statistics.messages.reduce((a, b) => a + b, 0), // Tổng số tin nhắn trong 7 ngày
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Màu cho Users
          "rgba(153, 102, 255, 0.6)", // Màu cho Posts
          "rgba(255, 159, 64, 0.6)", // Màu cho Messages
        ],
      },
    ],
  };

  // Tính toán người dùng hiển thị trên trang hiện tại
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Chuyển sang trang trước
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Chuyển sang trang tiếp theo
  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await apiRequest.get("/admin/posts");
        console.log("Posts data:", postsRes.data); // Log kiểm tra dữ liệu bài viết
        setPosts(postsRes.data);
        const usersRes = await apiRequest.get("/admin/users");
        setUsers(usersRes.data);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const handleApprovePost = async (postId) => {
    try {
      await apiRequest.put(`/posts/approve/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async (postId, authorRole) => {
    if (authorRole === "ADMIN") {
      toast.error("Cannot delete posts created by an ADMIN.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await apiRequest.delete(`/admin/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post!");
    }
  };
  

  const handleUpdatePostStatus = async (postId, currentStatus) => {
    if (currentStatus) {
      toast.info("This post is already approved and cannot be changed.");
      return;
    }
  
    const confirmUpdate = window.confirm(
      "Are you sure you want to approve this post?"
    );
    if (!confirmUpdate) return;
  
    try {
      await apiRequest.put(`/admin/posts/status`, { postId, isApproved: true });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, isApproved: true } : post
        )
      );
      toast.success("Post status updated to Approved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post status!");
    }
  };

  const handleDeleteUser = async (userId, role) => {
    if (role === "ADMIN") {
      toast.error("Cannot delete another ADMIN user.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await apiRequest.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user!");
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    const user = users.find((user) => user.id === userId);

    if (user.role === "ADMIN") {
      toast.error("Cannot change the role of another ADMIN user.");
      return;
    }

    if (user.role === newRole) {
      toast.info("Role is already set to the selected value.");
      return;
    }

    try {
      await apiRequest.put(`/admin/users/role`, { userId, role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("User role updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user role!");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error("All fields are required!");
      return;
    }

    console.log("User data being sent:", newUser); // Log kiểm tra dữ liệu người dùng

    try {
      const response = await apiRequest.post("/admin/users", newUser);
      setUsers((prev) => [...prev, response.data.user]);
      setNewUser({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
      });
      toast.success("User added successfully!");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to add user!";
      toast.error(errorMessage);
    }
  };

  const renderAddUser = () => (
    <div className="addUserPage">
      <div className="formContainer">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newUser.password !== newUser.confirmPassword) {
              toast.error("Passwords do not match!");
              return;
            }
            handleAddUser();
          }}
        >
          <h1>
            <FaUser /> ADD USER
          </h1>

          <div className="inputGroup">
            <label htmlFor="username">
              <FaUser /> Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              required
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
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
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              required
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
              value={newUser.confirmPassword || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="role">
              <FaUser /> Role
            </label>
            <select
              id="role"
              name="role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              required
            >
              <option value="USER">USER</option>
              <option value="AUTH">AUTH</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button type="submit">
            <FaUser /> ADD
          </button>
          {error && <span className="error">{error}</span>}
        </form>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="posts">
      <h2>All Posts</h2>
      <table className="postsTable">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Image</th>
            <th>Author</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.id}>
              <td>{index + 1}</td>
              <td>{post.title}</td>
              <td>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: "100px",
                    height: "auto",
                    borderRadius: "5px",
                  }}
                />
              </td>
              <td>
                {post.author ? (
                  <>
                    <img
                      src={post.author.avatar}
                      alt={post.author.username}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    {post.author.username}
                  </>
                ) : (
                  "Unknown"
                )}
              </td>
              <td>{new Date(post.date).toLocaleString("en-US", {})}</td>
              <td>
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    color: "#fff",
                    backgroundColor: post.isApproved ? "#28a745" : "#ffc107",
                    cursor: post.isApproved ? "not-allowed" : "pointer", // Vô hiệu hóa nếu đã Approved
                  }}
                  onClick={() => handleUpdatePostStatus(post.id, post.isApproved)}
                >
                  {post.isApproved ? "Approved" : "Pending"}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleDeletePost(post.id, post.author?.role)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsers = () => (
    <div className="users">
      <h2>All Users</h2>
      <div className="userGrid">
        {users.map((user) => (
          <div key={user.id} className="userCard">
            <img
              src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
              alt={user.username}
            />
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <p>
              Role:
              <select
                value={user.role}
                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="AUTH">AUTH</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </p>
            <button onClick={() => handleDeleteUser(user.id, user.role)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard">
      <h2>Statistics</h2>
      <div className="chartGrid">
        {/* Biểu đồ cột */}
        <div className="chartContainer">
          <h3>New Users in the Last 7 Days</h3>
          <Bar
            data={userChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "New Users" },
              },
            }}
          />
        </div>

        {/* Biểu đồ đường */}
        <div className="chartContainer">
          <h3>Messages in the Last 7 Days</h3>
          <Line
            data={messageChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Messages" },
              },
            }}
          />
        </div>

        <div className="chartRow">
          {/* Biểu đồ tròn 1 */}
          <div className="chartContainer pieChart">
            <h3>Posts in the Last 7 Days</h3>
            <Pie
              data={postChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Posts" },
                },
              }}
            />
          </div>

          {/* Biểu đồ tròn 2 */}
          <div className="chartContainer pieChart">
            <h3>Combined Data (Users, Posts, Messages)</h3>
            <Pie
              data={combinedChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Combined Data" },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "posts":
        return renderPosts();
      case "addUser":
        return renderAddUser();
      case "users":
        return renderUsers();
      default:
        return <h2>Welcome to the Dashboard</h2>;
    }
  };

  return (
    <div className="adminDashboard">
      <aside className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <ul className="menu">
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="fas fa-home"></i> Dashboard
          </li>
          <li
            className={activeTab === "posts" ? "active" : ""}
            onClick={() => setActiveTab("posts")}
          >
            <i className="fas fa-file-alt"></i> Posts
          </li>
          <li
            className={activeTab === "addUser" ? "active" : ""}
            onClick={() => setActiveTab("addUser")}
          >
            <i className="fas fa-user-plus"></i> Add User
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            <i className="fas fa-users"></i> Users
          </li>
        </ul>
      </aside>
      <main className="content">
        <header className="header">
          <div className="userInfo">
            <img
              src={currentUser?.avatar || "/noavatar.jpg"} // Hiển thị avatar nếu có, nếu không thì dùng ảnh mặc định
              alt={currentUser?.username || "User Avatar"}
            />
            <span>{currentUser?.username || "Guest"}</span>{" "}
            {/* Hiển thị tên người dùng */}
            
          </div>
          <button className="logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </header>
        <section className="mainContent">{renderContent()}</section>
      </main>
      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;