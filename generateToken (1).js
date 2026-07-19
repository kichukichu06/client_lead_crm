const jwt = require("jsonwebtoken");

/**
 * Signs a JWT for the given admin id.
 * The token is used by the client for all subsequent authenticated requests.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
