const ytpl = require("ytpl"); // Ensure you have this dependency

exports.getPlaylistUrl = async function (playlistUrl) {
  try {
    // Fetch playlist details
    const playlist = await ytpl(playlistUrl);

    // Extract video URLs
    const urls = playlist.items.map((item) => item.shortUrl);

    return { urls, songInfo: playlist.items };
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error; // Optional: rethrow to handle it in the caller
  }
};
