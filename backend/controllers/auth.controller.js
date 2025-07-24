import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  const { username, email, password, role = "USER" } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};

// ✅ Google Login
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Xác minh token Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    // Kiểm tra xem người dùng đã tồn tại chưa
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Tạo mật khẩu ngẫu nhiên
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Tạo người dùng mới nếu chưa tồn tại
      user = await prisma.user.create({
        data: {
          username: email.split("@")[0], // Sử dụng phần trước @ làm username
          email,
          password: hashedPassword, // Lưu mật khẩu đã băm
          avatar: picture || null, // Kiểm tra và lưu avatar nếu có
          role: "USER",
        },
      });
    } else {
      // Cập nhật avatar nếu người dùng đã tồn tại nhưng chưa có avatar
      if (!user.avatar && picture) {
        user = await prisma.user.update({
          where: { email },
          data: { avatar: picture },
        });
      }
    }

    // Tạo token JWT
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const { password, ...userInfo } = user;

    // Trả về thông tin người dùng và token
    res
      .cookie("token", jwtToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google login failed!" });
  }
};
