const { body } = require("express-validator");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const leadValidator = [
  body("name").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("phone")
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage("A valid phone number is required"),
  body("source")
    .optional()
    .isIn([
      "Website",
      "Referral",
      "Social Media",
      "Cold Call",
      "Email Campaign",
      "Advertisement",
      "Other",
    ])
    .withMessage("Invalid lead source"),
  body("status")
    .optional()
    .isIn(["New", "Contacted", "Converted"])
    .withMessage("Invalid status"),
];

module.exports = { registerValidator, loginValidator, leadValidator };
