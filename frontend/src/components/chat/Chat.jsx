import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { FaEnvelope, FaPaperPlane, FaSmile, FaCamera } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

function Chat({ chats, initialChat }) {
  const [chatList, setChatList] = useState(chats || []);
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate(); // Khởi tạo navigate
  const [selectedImage, setSelectedImage] = useState(null); // Thêm state để lưu hình ảnh đã chọn
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Trạng thái lưu ID tin nhắn được chọn

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    setChatList(chats);
  }, [chats]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (initialChat) {
      const selectedChat = chats.find((c) => c.id === initialChat);
      if (selectedChat) {
        setChat(selectedChat);
      }
    }
  }, [initialChat, chats]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest.get("/chats/" + id);

      if (!res.data.seenBy.includes(currentUser.id)) {
        await apiRequest.put(`/chats/read/${id}`);
        decrease();
        setChatList((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, seenBy: [...c.seenBy, currentUser.id] } : c
          )
        );
      }

      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    let imageUrl = null;
    if (selectedImage) {
      const imageData = new FormData();
      imageData.append("file", selectedImage);

      try {
        const uploadRes = await apiRequest.post("/upload", imageData); // API upload hình ảnh
        imageUrl = uploadRes.data.url; // Lấy URL hình ảnh từ response
      } catch (err) {
        console.log("Image upload failed:", err);
        return;
      }
    }

    if (!text && !imageUrl) return; // Không gửi nếu không có text hoặc hình ảnh

    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text, imageUrl });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      setSelectedImage(null); // Reset hình ảnh đã chọn
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await apiRequest.delete(`/messages/${messageId}`);
      setChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((message) => message.id !== messageId),
      }));
      socket.emit("deleteMessage", { messageId, chatId: chat.id });
      

      // Chuyển hướng đến /profile
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  // const handleDeleteChat = async (chatId) => {
  //   try {
  //     await apiRequest.delete(`/chats/${chatId}`);
  //     setChatList(prev => prev.filter(c => c.id !== chatId));
  //     if (chat?.id === chatId) {
  //       setChat(null);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      // Lắng nghe sự kiện nhận tin nhắn
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });

      // Lắng nghe sự kiện xóa tin nhắn
      socket.on("deleteMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: prev.messages.filter(
              (message) => message.id !== data.messageId
            ),
          }));
          read();
        }
      });
    }

    return () => {
      socket.off("getMessage");
      socket.off("deleteMessage"); // Hủy đăng ký sự kiện xóa tin nhắn
    };
  }, [socket, chat]);

  const handleEmojiClick = (emoji) => {
    const textarea = document.querySelector("textarea[name='text']");
    textarea.value += emoji.emoji; // Thêm emoji vào textarea
  };

  const handleSelectMessage = (messageId) => {
    // Nếu tin nhắn đã được chọn, bấm lại sẽ bỏ chọn
    setSelectedMessageId((prevId) => (prevId === messageId ? null : messageId));
  };

  return (
    <div className="chat">
      <div className="messages">
        <h1>
          <FaEnvelope /> Messages
        </h1>
        {chatList.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
            {/* <button 
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if(window.confirm('Bạn có chắc muốn xóa cuộc trò chuyện này?')) {
                  handleDeleteChat(c.id);
                }
              }}
            >
              <i className="fas fa-trash"></i>
            </button> */}
          </div>
        ))}
        {chatList.length === 0 && (
          <div className="no-messages">Không có tin nhắn nào</div>
        )}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <div className="close" onClick={() => setChat(null)}>
              <img src="./tab_close_inactive.svg" alt="close" />
            </div>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className={`chatMessage ${message.userId === currentUser.id ? "own" : ""}`}
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
                onClick={() => {
                  if (message.userId === currentUser.id) {
                    handleSelectMessage(message.id); // Chỉ xử lý nếu là tin nhắn của người dùng
                  }
                }}
              >
                {message.imageUrl && (
                  <img
                    src={
                      message.imageUrl.startsWith("http") // Kiểm tra nếu URL đã đầy đủ
                        ? message.imageUrl // Sử dụng URL đầy đủ
                        : `http://localhost:8800${message.imageUrl}` // Thêm tiền tố nếu cần
                    }
                    alt="sent"
                    className="chatImage"
                  />
                )}
                <div className="messageContent">
                  {message.text && <p>{message.text}</p>}
                  <div className="messageFooter">
                    <span>{format(message.createdAt)}</span>
                    {selectedMessageId === message.id && message.userId === currentUser.id && ( // Hiển thị nút delete nếu tin nhắn được chọn và là của người dùng
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện bấm vào tin nhắn
                          if (window.confirm("Bạn có chắc muốn xóa tin nhắn này?")) {
                            handleDeleteMessage(message.id);
                          }
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <div className="tools">
              <button
                type="button"
                onClick={() => document.querySelector('input[name="image"]').click()}
              >
                <FaCamera /> {/* Thay thế 📷 bằng FaCamera */}
              </button>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <FaSmile /> {/* Thay thế 😊 bằng FaSmile */}
              </button>
            </div>
            {showEmojiPicker && (
              <div className="emoji-picker">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            {selectedImage && (
              <div className="selected-image-preview">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => setSelectedImage(null)}
                >
                  Remove
                </button>
              </div>
            )}
            <div className="input-container">
              <textarea
                name="text"
                placeholder="Type a message or select an emoji..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.target.form.requestSubmit();
                  }
                }}
              ></textarea>
              <button type="submit">
                <FaPaperPlane /> Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
