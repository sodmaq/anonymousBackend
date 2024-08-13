const Message = require("../Models/messageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../Models/userModel");

// Import the users object
const users = require("../userSocketMap");

// const sendMessage = catchAsync(async (req, res, next) => {
//   const { recipientLink, content, type } = req.body;

//   // Validate input
//   if (!recipientLink || !content || !type) {
//     return next(
//       new AppError("Please provide recipientLink, content, and type", 400)
//     );
//   }

//   // Check if recipient exists
//   const sender = req.user._id;
//   const recipient = await User.findOne({ anonymousLink: recipientLink });

//   if (!recipient) {
//     return next(new AppError("User not found", 404));
//   }

//   // Create the message with recipient's _id
//   const message = await Message.create({
//     sender,
//     recipient: recipient._id,
//     content,
//     type,
//   });

//   // Access io instance
//   const io = req.app.get("io");

//   // Assuming you have a mapping of user IDs to socket IDs
//   const recipientSocketId = users[recipient._id];
//   if (recipientSocketId) {
//     io.to(recipientSocketId).emit("receive_message", message);
//   }

//   res.status(201).json({
//     status: "success",
//     data: {
//       message,
//     },
//   });
// });

const getMessages = catchAsync(async (req, res, next) => {
  const recipient = req.user._id;
  const messages = await Message.find({ recipient }).select("-sender");

  if (messages.length === 0) {
    return next(new AppError("No messages found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      length: messages.length,
      messages,
    },
  });
});

module.exports = { getMessages };
