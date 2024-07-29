const userSchema = require("../Models/userModel");

const signUP = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await userSchema.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User with the email already exists" });
  }
  const newUser = new userSchema({
    name,
    email,
    password,
    confirmPassword,
  });
  await newUser.save();
  res.json({ message: "User created successfully", newUser });
};

const login = async (req, res) => {};
module.exports = { signUP };
