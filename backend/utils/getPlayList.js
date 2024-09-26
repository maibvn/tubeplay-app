const ytpl = require("ytpl"); // Ensure you have this dependency

exports.getPlaylistUrl = async function (playlistUrl) {
  try {
    // Fetch playlist details
    const playlist = await ytpl(playlistUrl);
    const songs = playlist.items.map((item) => {
      return {
        title: item.title,
        shortUrl: item.shortUrl,
        bestThumbnail: item.bestThumbnail,
      };
    });

    const playlistInfo = {
      plTitle: playlist.title,
      plUrl: playlist.url,
      plSongNum: playlist.estimatedItemCount,
      songs: songs,
    };

    return { playlistInfo };
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error; // Optional: rethrow to handle it in the caller
  }
};
