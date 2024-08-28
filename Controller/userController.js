const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

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
  if (!user) return next(new AppError("User not found", 404));
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

module.exports = { getUser, getAllUsers, updateUser, deleteMe, deleteUser };
