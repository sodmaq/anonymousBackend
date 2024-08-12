const dotenv = require("dotenv");
const process = require("process");
const mongoose = require("mongoose");
const socket = require("socket.io");
const http = require("http");
const Message = require("./Models/messageModel");

// Import the users object
const users = require("./userSocketMap");

// Load environment variables from .env file
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("Unhandled exception shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.dataBasePassword
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.log("DB connection error:", err);
    process.exit(1);
  });

const app = require("./index");
const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Attach io to the app so it can be accessed in other parts of your app (e.g., controllers)
app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected");

  // When a user registers their ID (e.g., after login)
  socket.on("register", (payload) => {
    console.log("received register", payload);
    const userId = payload.data;
    users[userId] = socket.id; // Store the mapping
    console.log(`User ${userId} is registered with socket ID ${socket.id}`);
  });

  // When a user sends a message
  socket.on("send_message", async (data) => {
    // Save the message to the database
    const message = await Message.create({
      sender: data.senderId,
      recipient: data.recipientId,
      content: data.content,
      type: data.type,
    });

    // Emit the message to the recipient if they're connected
    const recipientSocketId = users[data.recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", message);
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    // Find and remove the user from the users object
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} with socket ID ${socket.id} disconnected`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening to server on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handling SIGTERM
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("Process terminated!!!");
  });
});
