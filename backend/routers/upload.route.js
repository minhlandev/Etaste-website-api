import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Lưu file tạm thời vào thư mục "uploads"

router.post("/", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No file uploaded!" });

  // Trả về URL của file (cần thay đổi nếu bạn lưu file trên cloud như S3, Cloudinary)
  const imageUrl = `/uploads/${file.filename}`;
  res.status(200).json({ url: imageUrl });
});

export default router;