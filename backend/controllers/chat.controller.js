import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Lấy tất cả chat
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    // Lấy thông tin receiver và format lại response
    const formattedChats = await Promise.all(
      chats.map(async (chat) => {
        // Đảm bảo receiverId tồn tại và là string hợp lệ
        const receiverId = chat.userIDs.find(id => id && id !== tokenUserId);
        
        if (!receiverId) {
          return null; // Bỏ qua chat không có receiver hợp lệ
        }

        try {
          const receiver = await prisma.user.findUnique({
            where: {
              id: receiverId // Đảm bảo id là string hợp lệ
            },
            select: {
              id: true,
              username: true,
              avatar: true
            }
          });

          if (!receiver) {
            return null; // Bỏ qua nếu không tìm thấy receiver
          }

          return {
            ...chat,
            receiver,
            lastMessage: chat.messages[0]?.text || chat.lastMessage || ""
          };
        } catch (error) {
          console.error(`Error fetching receiver ${receiverId}:`, error);
          return null;
        }
      })
    );

    // Lọc bỏ các chat null và trả về kết quả
    const validChats = formattedChats.filter(chat => chat !== null);

    res.status(200).json(validChats);
  } catch (err) {
    console.error("Get chats error:", err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  try {
    // Kiểm tra chat đã tồn tại
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            userIDs: {
              hasSome: [tokenUserId]
            }
          },
          {
            userIDs: {
              hasSome: [receiverId]
            }
          }
        ]
      }
    });

    if (existingChat) {
      // Nếu đã có chat, trả về chat đó
      return res.status(200).json(existingChat);
    }

    // Nếu chưa có, tạo chat mới
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        seenBy: [tokenUserId]
      }
    });

    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId]
        }
      },
      data: {
        seenBy: {
          push: tokenUserId
        }
      }
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};

export const deleteChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    // Kiểm tra chat tồn tại và user có quyền
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId]
        }
      }
    });

    if (!chat) {
      return res.status(403).json({ message: "Không có quyền xóa cuộc trò chuyện này!" });
    }

    // Xóa tất cả tin nhắn trong chat
    await prisma.message.deleteMany({
      where: {
        chatId: chatId
      }
    });

    // Xóa chat
    await prisma.chat.delete({
      where: {
        id: chatId
      }
    });

    res.status(200).json({ message: "Đã xóa cuộc trò chuyện!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa cuộc trò chuyện!" });
  }
};
