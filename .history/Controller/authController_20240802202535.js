const User = require("../Models/userModel");
const { generateToken } = require("../config/jwtToken");
const generateRefreshToken = require("../config/refreshToken");
const { calculateExpirationTime } = require("../config/jwtToken");

// sign up endpoint
const signUP = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User with the email already exists" });
  }
  const newUser = new User({
    name,
    email,
    password,
    confirmPassword,
  });
  await newUser.save();
  res.json({ message: "User created successfully", newUser });
};

//login endpoint
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const findUser = await User.findOne({ email }).select("+password");
  if (
    !findUser ||
    !(await findUser.correctPassword(password, findUser.password))
  ) {
    return res.status(400).json({ message: "Incorrect Email or Password" });
  }
  const refreshToken = generateRefreshToken(findUser._id);
  const expirationTime = calculateExpirationTime();
  res.status(200).json({
    user: findUser,
    token: generateToken(findUser._id),
    expiresIn: expirationTime,
    refreshToken: refreshToken,
  });
};
//Refresh token endpoint
const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  const newToken = generateToken(user._id);
  res.status(200).json({ token: newToken });
};

module.exports = { signUP, login };
