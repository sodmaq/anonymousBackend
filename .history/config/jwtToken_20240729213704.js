const jwt = require("jsonwebtoken");
const moment = require("moment");

const generateToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRES_IN; // e.g., '1h'
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
const calculateExpirationTime = () => {
  const expiresIn = process.env.JWT_EXPIRES_IN; // e.g., '1h'
  const expirationDate = moment().add(moment.duration(expiresIn));
  return expirationDate.toISOString();
};

module.exports = generateToken;
