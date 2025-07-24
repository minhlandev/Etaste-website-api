import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleChat = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // Kiểm tra nếu không phải bài viết của mình
      if (post.userId !== currentUser.id) {
        // Kiểm tra xem đã có chat với user này chưa
        const chatsRes = await apiRequest.get("/chats");
        const existingChat = chatsRes.data.find((chat) =>
          chat.userIDs.includes(post.userId)
        );

        let chatId;
        if (existingChat) {
          // Nếu đã có chat, dùng chat cũ
          chatId = existingChat.id;
        } else {
          // Nếu chưa có chat, tạo mới
          const newChatRes = await apiRequest.post("/chats", {
            receiverId: post.userId,
          });
          chatId = newChatRes.data.id;
        }

        // Gửi tin nhắn với thông tin bài viết
        const imageUrl = post.images?.[0] || null; // Lấy ảnh đầu tiên của bài viết
        await apiRequest.post(`/messages/${chatId}`, {
          text: `Tôi muốn biết thêm thông tin: ${post.title}`,
          imageUrl, // Gửi URL ảnh
          senderId: currentUser.id,
          receiverId: post.userId,
        });

        // Chuyển đến trang profile và mở khung chat với người đó
        navigate("/profile", { state: { chatId } });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(post.price)}
                </div>
              </div>
              <div className="user">
                <img
                  src={post.user.avatar ? post.user.avatar : "noavatar.jpg"}
                  alt=""
                />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature ">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/restaurant.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            {post.userId === currentUser?.id ? ( // Kiểm tra quyền sở hữu bài viết
              <>
                <span
                  className="post-status"
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    color: "#fff",
                    backgroundColor: post.isApproved ? "#28a745" : "#ffc107", // Màu xanh lá nếu Approved, màu vàng nếu Pending
                    marginRight: "10px",
                  }}
                >
                  {post.isApproved ? "Approved" : "Pending"} {/* Hiển thị trạng thái */}
                </span>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/posts/update/${post.id}`)} // Điều hướng đến trang chỉnh sửa bài viết
                >
                  <img src="/settings.svg" alt="Edit" />
                  Edit Post
                </button>
              </>
            ) : (
              <>
                <button
                  className="chat-btn"
                  onClick={handleChat} // Gửi tin nhắn đến chủ bài viết
                >
                  <img src="/chat.png" alt="Send a Message" />
                  Send a Message
                </button>
                <button
                  className={`save-btn ${saved ? "saved" : ""}`}
                  onClick={handleSave} // Lưu bài viết
                  style={{
                    backgroundColor: saved ? "#ff1493" : "white",
                  }}
                >
                  <img src="/save.png" alt="Save" />
                  {saved ? "Saved" : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
