const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }], // References Playlist
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model is already compiled to avoid overwriting
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
