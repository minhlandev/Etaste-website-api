import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const { text, imageUrl } = req.body; // Nhận URL hình ảnh từ frontend

  try {
    // Kiểm tra xem chat có tồn tại và người dùng có quyền truy cập không
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    // Tạo tin nhắn mới
    const message = await prisma.message.create({
      data: {
        text,
        imageUrl, // Lưu URL hình ảnh nếu có
        chatId,
        userId: tokenUserId,
      },
    });

    // Cập nhật thông tin chat (lastMessage và seenBy)
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: [tokenUserId],
        lastMessage: text || "Image", // Hiển thị "Image" nếu không có text
      },
    });

    res.status(200).json(message); // Trả về tin nhắn mới
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};

export const deleteMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const messageId = req.params.id;

  try {
    // Kiểm tra message tồn tại và thuộc về user
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        userId: tokenUserId
      }
    });

    if (!message) {
      return res.status(403).json({ message: "Không có quyền xóa tin nhắn này!" });
    }

    // Xóa tin nhắn
    await prisma.message.delete({
      where: {
        id: messageId
      }
    });

    // Cập nhật lastMessage của chat nếu cần
    const lastMessage = await prisma.message.findFirst({
      where: {
        chatId: message.chatId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    await prisma.chat.update({
      where: {
        id: message.chatId
      },
      data: {
        lastMessage: lastMessage?.text || ''
      }
    });

    res.status(200).json({ message: "Đã xóa tin nhắn!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa tin nhắn!" });
  }
};