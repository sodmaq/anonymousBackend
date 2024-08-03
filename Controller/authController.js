const User = require("../Models/userModel");
const { generateToken } = require("../config/jwtToken");
const generateRefreshToken = require("../config/refreshToken");
const { calculateExpirationTime } = require("../config/jwtToken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// sign up endpoint
const signUP = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return next(
      new AppError(
        "Please provide name, email, password and confirmPassword",
        400
      )
    );
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }
  const newUser = new User({
    name,
    email,
    password,
    confirmPassword,
  });
  await newUser.save();
  res.json({ message: "User created successfully", newUser });
});
//login endpoint
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const findUser = await User.findOne({ email }).select("+password");
  if (
    !findUser ||
    !(await findUser.correctPassword(password, findUser.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const refreshToken = generateRefreshToken(findUser._id);
  const expirationTime = calculateExpirationTime();
  res.status(200).json({
    user: findUser,
    token: generateToken(findUser._id),
    expiresIn: expirationTime,
    refreshToken: refreshToken,
  });
});

//Refresh token endpoint
const handleRefreshToken = async (req, res) => {
  const { user } = req;
  const newToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  res.status(200).json({ token: newToken, refreshToken: refreshToken });
};
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide current and new passwords", 400));
  }
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  user.password = newPassword;
  user.confirmPassword = newPassword;
  await user.save();
  res.status(200).json({ status: "success", message: "Password updated" });
});

module.exports = { signUP, login, handleRefreshToken, updatePassword };
