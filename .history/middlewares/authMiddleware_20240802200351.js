const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Authorization token required" });
  }
  const token = authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select("-password");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Authorization token invalid" });
  }
};
