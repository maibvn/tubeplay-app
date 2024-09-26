const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist");

// Route to get playlists
router.get("/generate", playlistController.generatePlaylist);

router.get("/playlists", playlistController.getAllPlaylists);

// Route to add a song to a playlist
router.get("/temp/:unregUserId", playlistController.getTempSongs);

// Route to add a song to a playlist
router.get("/:playlistId", playlistController.getSinglePlaylist);

router.get("/", playlistController.checkAuth);

module.exports = router;
