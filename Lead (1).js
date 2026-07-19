const mongoose = require("mongoose");

// A single note / timeline entry attached to a lead
const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Note text is required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, "Please provide a valid phone number"],
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      enum: [
        "Website",
        "Referral",
        "Social Media",
        "Cold Call",
        "Email Campaign",
        "Advertisement",
        "Other",
      ],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted"],
      default: "New",
    },
    notes: [noteSchema],
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Unique index on email so duplicate leads can't be created for the same address
leadSchema.index({ email: 1 }, { unique: true });

// Text index to support fast search across common fields
leadSchema.index({ name: "text", email: "text", company: "text" });

module.exports = mongoose.model("Lead", leadSchema);
