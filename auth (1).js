const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");

/**
 * Protects routes by requiring a valid Bearer JWT in the Authorization header.
 * Attaches the authenticated admin (without password) to req.admin.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        res.status(401);
        throw new Error("Not authorized, admin not found");
      }

      return next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token invalid or expired");
    }
  }

  res.status(401);
  throw new Error("Not authorized, no token provided");
});

module.exports = { protect };
