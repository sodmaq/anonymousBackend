const jwt = require("jsonwebtoken");
const moment = require("moment");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { process.env.JWT_EXPIRES_IN });
};
const calculateExpirationTime = () => {
  const expiresIn = process.env.JWT_EXPIRES_IN; // e.g., '1h'
  const expirationDate = moment().add(moment.duration(expiresIn));
  return expirationDate.toISOString();
};

module.exports = generateToken;
