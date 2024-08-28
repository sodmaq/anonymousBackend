const Message = require("../Models/messageModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../Models/userModel");

const sendMessage = catchAsync(async (req, res, next) => {
  const { recipientLink, content } = req.body;

  // Validate input
  if (!recipientLink || !content) {
    return next(
      new AppError("Please provide recipientLink, content, and type", 400)
    );
  }

  // Check if recipient exists
  // const sender = req.user._id;
  const recipient = await User.findOne({ anonymousLink: recipientLink });

  if (!recipient) {
    return next(new AppError("User not found", 404));
  }

  // Create the message with recipient's _id

  const message = await Message.create({
    // sender,
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

  //mark message as read
  await Message.updateMany({ _id: { $in: messages } }, { isRead: true });

  // Respond with the messages
  res.status(200).json({
    status: "success",
    data: {
      length: messages.length,
      messages,
    },
  });
});

module.exports = { getMessages, sendMessage };
