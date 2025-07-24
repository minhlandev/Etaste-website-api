import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import "./card.scss";

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(item.isSaved);

  const handleChatClick = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (item.userId !== currentUser.id) {
      try {
        const chatsRes = await apiRequest.get("/chats");
        const existingChat = chatsRes.data.find((chat) =>
          chat.userIDs.includes(item.userId)
        );

        let chatId;
        if (existingChat) {
          chatId = existingChat.id;
        } else {
          const newChatRes = await apiRequest.post("/chats", {
            receiverId: item.userId,
          });
          chatId = newChatRes.data.id;
        }

        let imageUrl = item.images?.[0] || null;

        // Không xử lý thêm nếu URL đã đúng
        console.log("Final Image URL:", imageUrl);

        await apiRequest.post(`/messages/${chatId}`, {
          text: `Tôi muốn biết thêm thông tin: ${item.title}`,
          imageUrl, // Gửi URL trực tiếp
          senderId: currentUser.id,
          receiverId: item.userId,
        });

        // Log payload để kiểm tra
        console.log("Payload sent to API:", {
          text: `Check out this post: ${item.title}`,
          imageUrl,
          senderId: currentUser.id,
          receiverId: item.userId,
        });

        navigate("/profile", { state: { chatId } });
      } catch (err) {
        console.error("Error starting chat:", err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setIsSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", {
        postId: item.id,
      });
    } catch (err) {
      console.error("Error saving post:", err);
      setIsSaved((prev) => !prev); // Revert state on error
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/posts/update/${item.id}`); // Redirect to the update page
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt={item.title || "Post Image"} />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="Location" />
          <span>{item.address}</span>
        </p>
        <p className="price">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.price)}
        </p>

        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="Bedroom" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="Bathroom" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            {item.userId === currentUser?.id ? (
              <button className="edit-btn" onClick={handleEdit}>
              <img src="./settings.svg" alt="Edit" />
            </button>
            ) : (
              <>
                <button
                  className={`save-btn ${isSaved ? "saved" : ""}`}
                  onClick={handleSave}
                >
                  <img src="/save.png" alt={isSaved ? "Unsave" : "Save"} />
                </button>
                <button
                  className={`chat-btn ${
                    item.userId === currentUser?.id ? "disabled" : ""
                  }`}
                  onClick={handleChatClick}
                  disabled={item.userId === currentUser?.id}
                >
                  <img src="/chat.png" alt="Chat" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Card;