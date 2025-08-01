const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const axios = require("axios");

//ask question
const askQuestion = catchAsync(async (req, res, next) => {
  const { question } = req.body;

  // Validate question
  if (!question || typeof question !== "string") {
    return next(new AppError("Question must be a valid string", 400));
  }

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-light",
        prompt: question, // This should be a STRING, not an object
        max_tokens: 150,
        temperature: 0.8,
        stop_sequences: ["\n\n"], // Stop at double newline for cleaner responses
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return next(
        new AppError(`Cohere API error: ${data.message}`, response.status)
      );
    }

    // Extract the generated text
    const answer = data.generations[0].text.trim();

    res.status(200).json({
      status: "success",
      data: {
        response: answer,
      },
    });
  } catch (error) {
    return next(new AppError("Failed to generate response", 500));
  }
});

// get A user
const getUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// get all users
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ deleted: { $ne: true } });
  if (!users) return next(new AppError("No users found", 404));
  res.status(200).json({
    status: "success",
    data: {
      length: users.length,
      users,
    },
  });
});

// update user
const updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password update. Please use /updatePassword",
        400
      )
    );
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",

    data: {
      user,
    },
  });
});

// delete user for user
const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  user.isActive = false;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "user deleted successfully",
    data: {
      user,
    },
  });
});

// delete user for admin
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  user.deleted = true;
  user.deletedAt = new Date();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "user deleted successfully",
    data: {
      user,
    },
  });
});

module.exports = {
  getUser,
  getAllUsers,
  updateUser,
  deleteMe,
  deleteUser,
  askQuestion,
};
