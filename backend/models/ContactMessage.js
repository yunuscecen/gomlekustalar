const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },
    company: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
    adminNote: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);