const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist");

// Route to get playlists
router.get("/", playlistController.getPlaylist);

// Route to add a song to a playlist
router.get("/songs", playlistController.getAllSongs);

module.exports = router;
