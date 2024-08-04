const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

// get A user
exports.getUser = catchAsync(async (req, res, next) => {
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
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
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
exports.updateUser = catchAsync(async (req, res, next) => {
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

// delete user
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
    data: {
      user,
    },
  });
});
