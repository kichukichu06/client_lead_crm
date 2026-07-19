const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getMe } = require("../controllers/authController");
const { registerValidator, loginValidator } = require("../utils/validators");
const { protect } = require("../middleware/auth");

router.post("/register", registerValidator, registerAdmin);
router.post("/login", loginValidator, loginAdmin);
router.get("/me", protect, getMe);

module.exports = router;
