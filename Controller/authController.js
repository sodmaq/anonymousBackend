const User = require("../Models/userModel");
const { generateToken } = require("../config/jwtToken");
const generateRefreshToken = require("../config/refreshToken");
const { calculateExpirationTime } = require("../config/jwtToken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { sendEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;

// sign up endpoint
const signUP = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validate input
  if (!name || !email || !password || !confirmPassword) {
    return next(
      new AppError(
        "Please provide name, email, password, and confirmPassword",
        400
      )
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }
  // Create new user
  const newUser = new User({
    name,
    email,
    password,
    confirmPassword,
  });
  await newUser.save();
  // create verification token
  const verificationToken = jwt.sign(
    { id: newUser._id },
    process.env.JWT_VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  const verificationURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verifyEmail/${verificationToken}`;
  // Send welcome email
  try {
    const html = `
        <html>
          <body>
            <p>Hi ${name},</p>
            <p>Welcome to <strong>Gossip_Me</strong>! 🎉</p>
            <p>We’re excited to have you on board. Please verify your email address by clicking the link below:</p>
            <p><a href="${verificationURL}">Verify your email</a></p>
            <p>If you have any questions or need assistance, feel free to reach out to us.</p>
            <p>Thank you for joining us!</p>
            <p>Best regards,<br>The Gossip_Me Team</p>
          </body>
        </html>`;
    await sendEmail(email, name, html);
  } catch (error) {}

  // Respond to client
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
  if (!findUser.emailVerified) {
    return next(new AppError("Please verify your email", 401));
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
const verifyEmail = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  // Verify token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_VERIFICATION_TOKEN_SECRET
    );
  } catch (err) {
    return next(new AppError("Invalid or expired token", 400));
  }

  // Find the user and verify their email
  let user;
  try {
    user = await User.findById(decoded.id);
  } catch (err) {
    return next(new AppError("Error fetching user", 500));
  }

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.emailVerified = true;
  user.isActive = true;

  try {
    // Skip validation before saving
    await user.save({ validateBeforeSave: false });
  } catch (err) {
    return next(new AppError("Error saving user", 500));
  }

  res.json({ message: "Email verified successfully" });
});

module.exports = {
  signUP,
  login,
  handleRefreshToken,
  updatePassword,
  verifyEmail,
};
