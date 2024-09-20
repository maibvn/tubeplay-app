const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  dropboxId: {
    type: String,
    required: true,
    unique: true, // Ensure this is unique for each Dropbox account
  },
  dropboxAccessToken: {
    type: String,
    required: true,
  },
  dropboxRefreshToken: {
    type: String,
    required: true,
  },
  tokenExpiration: {
    type: Date,
    required: true,
  },
  dropboxEmail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
