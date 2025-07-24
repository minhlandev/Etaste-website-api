import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  const tokenUserId = req.userId;

  try {
    const posts = await prisma.post.findMany({
      where: {
        isApproved: true, // Chỉ lấy bài viết đã được phê duyệt
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
      orderBy: {
        createdAt: "desc", // Sắp xếp bài đăng theo thời gian giảm dần
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          }
        },
        savedPosts: {
          where: {
            userId: tokenUserId
          }
        }
      }
    });

    // Thêm trường isSaved cho mỗi post
    const postsWithSaveStatus = posts.map(post => ({
      ...post,
      isSaved: post.savedPosts.length > 0,
      savedPosts: undefined // Xóa data không cần thiết
    }));

    res.status(200).json(postsWithSaveStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;
    let isSaved = false;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          // Nếu token không hợp lệ, trả về post với isSaved = false
          return res.status(200).json({ ...post, isSaved: false });
        }
        // Kiểm tra trạng thái saved trong database
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        isSaved = !!saved; // Chuyển thành boolean
        return res.status(200).json({ ...post, isSaved });
      });
    } else {
      // Nếu không có token, trả về post với isSaved = false
      res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, price, postDetail } = req.body;

  try {
    // Validate required fields
    if (!title || !price || !postDetail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert price to an integer
    const parsedPrice = parseInt(price, 10);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Invalid price format" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        price: parsedPrice, // Use the parsed integer value
        postDetail: {
          update: {
            desc: postDetail.desc || "",
            utilities: postDetail.utilities || "",
            pet: postDetail.pet || "",
            income: postDetail.income || "",
          },
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};