import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUser = [];

// Add a user with support for multiple socketIds
const addUser = (userId, socketId) => {
  const user = onlineUser.find((user) => user.userId === userId);
  if (user) {
    // Add the socketId if it doesn't already exist
    if (!user.socketIds.includes(socketId)) {
      user.socketIds.push(socketId);
    }
  } else {
    onlineUser.push({ userId, socketIds: [socketId] });
  }
  console.log("Current online users:", onlineUser);
};

// Remove a socketId and clean up the user if no socketIds remain
const removeUser = (socketId) => {
  onlineUser = onlineUser
    .map((user) => ({
      ...user,
      socketIds: user.socketIds.filter((id) => id !== socketId),
    }))
    .filter((user) => user.socketIds.length > 0);
  console.log("Updated online users after removal:", onlineUser);
};

// Get a user by userId
const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Add a new user
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(`User added: ${userId}, Socket ID: ${socket.id}`);
  });

  // Handle sending messages
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      // Emit the message to all valid socketIds of the receiver
      receiver.socketIds.forEach((socketId) => {
        if (io.sockets.sockets.get(socketId)) {
          io.to(socketId).emit("getMessage", data);
        } else {
          console.log(`Invalid socketId detected and skipped: ${socketId}`);
        }
      });
      console.log(`Message sent to receiver: ${receiverId}`);
    } else {
      console.log(`Receiver not found: ${receiverId}`);
      // Optionally, handle the case where the receiver is offline
      // For example, store the message in a database for later delivery
    }
  });

  // Handle deleting messages
  socket.on("deleteMessage", ({ chatId, messageId }) => {
    console.log(`Delete message request received for chatId: ${chatId}, messageId: ${messageId}`);

    // Notify all users in the chat about the deleted message
    onlineUser.forEach((user) => {
      user.socketIds.forEach((socketId) => {
        if (io.sockets.sockets.get(socketId)) {
          io.to(socketId).emit("deleteMessage", { chatId, messageId });
        }
      });
    });

    console.log(`Message deleted for chatId: ${chatId}, messageId: ${messageId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    removeUser(socket.id);

    // Log the current state of online users
    if (onlineUser.length === 0) {
      console.log("No users are currently online.");
    }
  });
});

const PORT = 4000;
io.listen(PORT);
console.log(`Socket server is running on port ${PORT}`);