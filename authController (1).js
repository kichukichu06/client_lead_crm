const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Register a new admin account
 * @route   POST /api/auth/register
 * @access  Public (in production you may want to restrict this to a superadmin)
 */
const registerAdmin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password } = req.body;

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    res.status(400);
    throw new Error("An admin with that email already exists");
  }

  const admin = await Admin.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    },
  });
});

/**
 * @desc    Authenticate admin & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginAdmin = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    },
  });
});

/**
 * @desc    Get currently logged in admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.admin });
});

module.exports = { registerAdmin, loginAdmin, getMe };
