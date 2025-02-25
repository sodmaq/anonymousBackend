const Message = require("../Models/messageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../Models/userModel");

const sendMessage = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  const { recipientLink } = req.params;

  // Validate input
  if (!content) {
    return next(new AppError("Please provide message content", 400));
  }

  // Check if recipient exists
  const recipient = await User.findOne({ anonymousLink: recipientLink });

  if (!recipient) {
    return next(new AppError("User not found", 404));
  }

  // Create the message with recipient's _id
  const message = await Message.create({
    recipient: recipient._id,
    content,
  });

  res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
});

const getMessages = catchAsync(async (req, res, next) => {
  const recipient = req.user._id;

  // Create the initial query, filtering messages by recipient
  let query = Message.find({ recipient });

  // Pagination logic
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // If the page number is provided, check if it exists
  if (req.query.page) {
    const numMessages = await Message.countDocuments({ recipient });
    if (skip >= numMessages) {
      return next(new AppError("This page does not exist", 404));
    }
  }

  // Execute the query
  const messages = await query;

  // Check if any messages were found
  if (messages.length === 0) {
    return next(new AppError("No messages found", 404));
  }

  // Respond with the messages
  res.status(200).json({
    status: "success",
    data: {
      length: messages.length,
      messages,
    },
  });
});

const deleteMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findById(req.params.messageId);
  if (!message) {
    return next(new AppError("Message not found", 404));
  }
  await message.remove();
  res.status(200).json({
    status: "success",
    message: "Message deleted successfully",
  });
});

module.exports = { getMessages, sendMessage, deleteMessage };
