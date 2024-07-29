const jwt = require("jsonwebtoken");
const moment = require("moment");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = generateToken;
