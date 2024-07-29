const userSchema = require("../Models/userModel");

const signUP = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await userSchema.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newUser = new userSchema({
    name,
    email,
    password,
  });
  await newUser.save();
  res.json({ message: "User created successfully" });
};

module.exports = { signUP };
