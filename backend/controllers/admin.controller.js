import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users!" });
  }
};

export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user role!" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Xóa tất cả bài viết của người dùng
    const userPosts = await prisma.post.findMany({
      where: { userId },
      select: { id: true },
    });

    const postIds = userPosts.map((post) => post.id);

    // Xóa tất cả PostDetail liên quan đến các bài viết của người dùng
    await prisma.postDetail.deleteMany({
      where: { postId: { in: postIds } },
    });

    // Xóa tất cả SavedPost liên quan đến các bài viết của người dùng
    await prisma.savedPost.deleteMany({
      where: { postId: { in: postIds } },
    });

    // Xóa tất cả SavedPost do user đã lưu (liên quan đến userId)
    await prisma.savedPost.deleteMany({
      where: { userId },
    });

    // Xóa tất cả bài viết của người dùng
    await prisma.post.deleteMany({
      where: { userId },
    });

    // Xóa tất cả tin nhắn liên quan đến người dùng
    await prisma.message.deleteMany({
      where: { userId },
    });

    // Xóa tất cả cuộc trò chuyện liên quan đến người dùng
    await prisma.chat.deleteMany({
      where: { userIDs: { has: userId } },
    });

    // Xóa người dùng
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User and all related data deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user and related data!" });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true, // Lấy tên tác giả
            avatar: true,   // Lấy ảnh đại diện của tác giả
            email: true,    // Lấy email của tác giả
          },
        },
      },
    });

    // Định dạng lại dữ liệu để bao gồm Title, Image, Author, Date, và isApproved
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      image: post.images?.[0] || null, // Lấy ảnh đầu tiên từ mảng images
      author: {
        username: post.user?.username || "Unknown", // Kiểm tra nếu không có user
        avatar: post.user?.avatar || "/noavatar.jpg", // Ảnh mặc định nếu không có avatar
        email: post.user?.email || "N/A", // Email mặc định nếu không có
      },
      date: post.createdAt, // Trả về giá trị gốc của createdAt
      isApproved: post.isApproved, // Thêm trường isApproved
    }));

    res.status(200).json(formattedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts!" });
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    await prisma.$transaction([
      // Xóa PostDetail liên quan đến bài viết
      prisma.postDetail.deleteMany({
        where: { postId },
      }),

      // Xóa SavedPost liên quan đến bài viết
      prisma.savedPost.deleteMany({
        where: { postId },
      }),

      // Xóa bài viết
      prisma.post.delete({
        where: { id: postId },
      }),
    ]);

    res.status(200).json({ message: "Post and all related data deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post and related data!" });
  }
};

export const addUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Kiểm tra vai trò hợp lệ
  const validRoles = ["USER", "AUTH", "ADMIN"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role!" });
  }

  try {
    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: "User added successfully!", user: newUser });
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      res.status(400).json({ message: "Email or username already exists!" });
    } else {
      res.status(500).json({ message: "Failed to add user!" });
    }
  }
};

export const updatePostStatus = async (req, res) => {
  const { postId, isApproved } = req.body;

  try {
    // Cập nhật trạng thái bài viết
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { isApproved },
    });

    res.status(200).json({ message: "Post status updated successfully!", post: updatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post status!" });
  }
};

export const getUserStatistics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo, // Lọc user được tạo trong 7 ngày qua
        },
      },
    });

    // Tạo mảng đếm số lượng user theo từng ngày
    const statistics = Array(7).fill(0);
    users.forEach((user) => {
      const dayIndex = Math.floor(
        (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        statistics[6 - dayIndex]++; // Đếm ngược từ hôm nay
      }
    });

    res.json(statistics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user statistics" });
  }
};

export const getPostStatistics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo, // Lọc bài post được tạo trong 7 ngày qua
        },
      },
    });

    // Tạo mảng đếm số lượng bài post theo từng ngày
    const statistics = Array(7).fill(0);
    posts.forEach((post) => {
      const dayIndex = Math.floor(
        (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24)
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        statistics[6 - dayIndex]++; // Đếm ngược từ hôm nay
      }
    });

    res.json(statistics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch post statistics" });
  }
};

export const getMessageStatistics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const messages = await prisma.message.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo, // Lọc tin nhắn được tạo trong 7 ngày qua
        },
      },
    });

    // Tạo mảng đếm số lượng tin nhắn theo từng ngày
    const statistics = Array(7).fill(0);
    messages.forEach((message) => {
      const dayIndex = Math.floor(
        (new Date() - new Date(message.createdAt)) / (1000 * 60 * 60 * 24)
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        statistics[6 - dayIndex]++; // Đếm ngược từ hôm nay
      }
    });

    res.json(statistics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch message statistics" });
  }
};
