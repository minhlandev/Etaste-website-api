import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate, useLocation } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaSignOutAlt, FaUserEdit, FaPlus, FaList, FaBookmark, FaUserCircle, FaTachometerAlt } from "react-icons/fa";

function ProfilePage() {
  const data = useLoaderData();
  const location = useLocation();
  const chatId = location.state?.chatId || null;

  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          {/* User Information Section */}
          <div className="title">
            <h1>
              <FaUserCircle /> User Information {/* Thêm icon vào tiêu đề */}
            </h1>
            <Link to="/profile/update">
              <button>
                <FaUserEdit /> Update Profile
              </button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="User Avatar" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Admin Dashboard Link (Visible for ADMIN role) */}
          {currentUser.role === "ADMIN" && (
            <div className="adminDashboardLink">
              <Link to="/admin/dashboard">
                <button>
                  <FaTachometerAlt /> Admin Dashboard
                </button>
              </Link>
            </div>
          )}

          {/* My List Section (Visible for non-USER roles) */}
          {currentUser.role !== "USER" && (
            <>
              <div className="title">
                <h1>
                  <FaList /> My List
                </h1>
                <Link to="/add">
                  <button>
                    <FaPlus /> Create New Post
                  </button>
                </Link>
              </div>
              <Suspense fallback={<p>Loading...</p>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
                >
                  {(postResponse) => (
                    <List
                      posts={postResponse.data.userPosts.map((post) => ({
                        ...post,
                        isSaved: post.isSaved || false, // Ensure isSaved always has a value
                        isApproved: post.isApproved, // Thêm trạng thái bài viết
                      }))}
                      showStatus={true} // Hiển thị trạng thái bài viết
                    />
                  )}
                </Await>
              </Suspense>
            </>
          )}

          {/* Saved List Section */}
          <div className="title">
            <h1>
              <FaBookmark /> Saved List
            </h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading saved posts!</p>}
            >
              {(postResponse) => (
                <List
                  posts={postResponse.data.savedPosts.map((post) => ({
                    ...post,
                    isSaved: true, // Saved posts always have isSaved = true
                  }))}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Chat Section */}
      <div className="chatContainer">
        <div className="wrapper">
          <div className="title">
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => (
                <Chat chats={chatResponse.data} initialChat={chatId} />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
