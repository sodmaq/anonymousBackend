const jwt = require("jsonwebtoken");
const moment = require("moment");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
const calculateExpirationTime = (expiresIn) => {
  return moment().add(moment.duration(expiresIn)).toISOString();
};

module.exports = generateToken;
