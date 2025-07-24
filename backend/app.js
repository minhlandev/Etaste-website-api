import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import postRoute from "./routers/post.route.js";
import authRoute from "./routers/auth.route.js";
import userRouter from "./routers/user.route.js"
import chatRoute from "./routers/chat.route.js"
import messageRoute from "./routers/message.route.js"
import adminRouter from "./routers/admin.route.js";
import up from "./routers/upload.route.js"
import path from 'path';
import { fileURLToPath } from "url";

// Tạo __dirname thủ công
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/backend/users",userRouter);
app.use("/backend/posts", postRoute);
app.use("/backend/auth", authRoute);
app.use("/backend/chats", chatRoute);
app.use("/backend/messages", messageRoute);
app.use("/backend/admin", adminRouter);
app.use("/backend/upload", up);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(8800,()=>{
    console.log("Server is running");
});