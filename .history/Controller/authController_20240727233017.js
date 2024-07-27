const userSchema = require("../Models/userModel");

const signUP = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new userSchema({
    name,
    email,
    password,
  });
  await newUser.save();
  res.json({ message: "User created successfully" });
};

module.exports = { signUP };
