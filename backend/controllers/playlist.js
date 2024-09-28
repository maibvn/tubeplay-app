const { getPlaylistUrl } = require("../utils/getPlayList");
const { uploadToDropbox } = require("../utils/uploadToDropbox");
const User = require("../models/user");
const Playlist = require("../models/playlist");
const { v4: uuidv4 } = require("uuid");

// Helper to handle user playlist logic
const handleUserPlaylist = async (user, playlistInfo) => {
  if (!user) return null;

  const userEmail = user.email;
  const existingPlaylist = await Playlist.findOne({
    plUrl: playlistInfo.plUrl,
  });
  if (existingPlaylist) return existingPlaylist._id;

  const newPlaylist = new Playlist({
    plTitle: playlistInfo.plTitle,
    plUrl: playlistInfo.plUrl,
    plSongNum: playlistInfo.plSongNum,
    songs: playlistInfo.songs,
  });

  await newPlaylist.save();
  user.playlists.push(newPlaylist._id);
  await user.save();

  return newPlaylist._id;
};

// Helper to clean song titles
const cleanSongTitles = (songs, uniqueId) => {
  return songs.map((s) => ({
    ...s,
    title: s.title
      .replace(new RegExp(`^${uniqueId}-`), "")
      .replace(/\.mp3$/, ""),
  }));
};

exports.checkAuth = (req, res) => {
  // console.log("checking auth", req.user);
  // Check if user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  // Access user email from req.userEmail or res.locals.userEmail
  const userEmail = req.user.email;

  res.status(200).json({ message: "Authenticated", email: userEmail });
};

exports.generatePlaylist = async (req, res, next) => {
  const playlistUrl = req.query.plUrl;
  if (!playlistUrl) {
    return res.status(400).json({
      message: "Bad Request: playlistUrl is required",
      userEmail: req.user?.email || null,
    });
  }

  const uniqueId = req.user ? null : "123";

  try {
    const { playlistInfo } = await getPlaylistUrl(playlistUrl);
    const results = await uploadToDropbox(playlistInfo.songs, uniqueId, req);

    const updatedSongs = results.map((song) => ({
      ...song,
      dropboxUrl: song.dropboxUrl.replace(/dl=0$/, "dl=1"),
    }));
    playlistInfo.songs = updatedSongs;

    let playlistId = await handleUserPlaylist(req.user, playlistInfo);

    const cleanedSongs = cleanSongTitles(playlistInfo.songs, uniqueId);
    playlistInfo.songs = cleanedSongs;

    res.status(200).json({
      playlistId,
      playlistInfo,
      nonRegisterUserId: uniqueId,
    });
  } catch (err) {
    console.error("Error processing playlist:", err);
    res.status(500).json({ message: "Error processing playlist", error: err });
  }
};

// exports.generatePlaylist = async (req, res, next) => {
//   const playlistUrl = req.query.plUrl;
//   if (!playlistUrl) {
//     return res.status(400).json({
//       message: "Bad Request: playlistUrl is required",
//       userEmail: req.user ? req.user.email : null,
//     });
//   }
//   // const uniqueId = uuidv4(); // Generate a UUID
//   let uniqueId = null;

//   if (!req.user) {
//     uniqueId = "123";
//   }

//   try {
//     const { playlistInfo } = await getPlaylistUrl(playlistUrl);

//     const songs = playlistInfo.songs;
//     const results = await uploadToDropbox(songs, uniqueId, req);

//     const updatedSongs = results.map((song) => ({
//       ...song,
//       dropboxUrl: song.dropboxUrl.replace(/dl=0$/, "dl=1"),
//     }));

//     playlistInfo.songs = updatedSongs;

//     let playlistId = null;
//     if (req.user) {
//       const userEmail = req.user.email; // Email of the authenticated user

//       // Find the user based on the email in req.user
//       const user = await User.findOne({ email: userEmail });
//       // Check if a playlist with the same plUrl already exists
//       const existingPlaylist = await Playlist.findOne({
//         plUrl: playlistInfo.plUrl,
//       });

//       if (existingPlaylist) {
//         playlistId = existingPlaylist._id;
//       } else {
//         const newPlaylist = new Playlist({
//           plTitle: playlistInfo.plTitle,
//           plUrl: playlistInfo.plUrl,
//           plSongNum: playlistInfo.plSongNum,
//           songs: playlistInfo.songs, // Array of song objects
//         });

//         // Save the playlist to the database
//         await newPlaylist.save();

//         // Add the playlist's ObjectId to the user's playlists array
//         user.playlists.push(newPlaylist._id);
//         playlistId = newPlaylist._id;

//         // Save the updated user
//         await user.save();
//       }
//     }

//     let cleanedTitleSongs;
//     if (!req.user) {
//       cleanedTitleSongs = playlistInfo.songs.map((s) =>
//         s.title
//           .replace(new RegExp(`^${uniqueId}-`), "") // Remove the prefix + suffix
//           .replace(/\.mp3$/, "")
//       );
//     } else {
//       cleanedTitleSongs = playlistInfo.songs.map((s) =>
//         s.title.replace(/\.mp3$/, "")
//       );
//     }
//     playlistInfo.songs = playlistInfo.songs.map((s, i) => ({
//       ...s,
//       title: cleanedTitleSongs[i],
//     }));

//     res.status(200).json({
//       playlistId: playlistId,
//       playlistInfo: playlistInfo,
//       nonRegisterUserId: uniqueId,
//     });
//   } catch (err) {
//     console.error("Error processing playlist:", err);
//     res.status(500).json({ message: "Error processing playlist", error: err });
//   }
// };

exports.getSinglePlaylist = async (req, res) => {
  const dbx = req.dbx;
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  const { playlistId } = req.params;
  try {
    // Find the playlist by its ID
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const cleanedTitleSongs = playlist.songs.map((s) =>
      s.title.replace(/\.mp3$/, "")
    );
    playlist.songs = playlist.songs.map((s, i) => ({
      ...s,
      title: cleanedTitleSongs[i],
    }));

    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTempSongs = async (req, res) => {
  const dbx = req.dbx;
  const { unregUserId } = req.params;

  try {
    const response = await dbx.filesListFolder({ path: "/temp" });
    const files = await Promise.all(
      response.result.entries.map(async (entry) => {
        if (
          entry[".tag"] === "file" &&
          entry.name.endsWith(".mp3") &&
          entry.name.includes(unregUserId)
        ) {
          try {
            const sharedLinkResponse = await dbx.sharingListSharedLinks({
              path: entry.path_lower,
              direct_only: true,
            });
            let sharedLink =
              sharedLinkResponse.result.links.length > 0
                ? sharedLinkResponse.result.links[0].url.replace(
                    "dl=0",
                    "raw=1"
                  )
                : (
                    await dbx.sharingCreateSharedLinkWithSettings({
                      path: entry.path_lower,
                    })
                  ).result.url.replace("dl=0", "raw=1");

            return {
              title: entry.name,
              dropboxUrl: sharedLink,
            };
          } catch {
            return null; // Handle any errors by returning null
          }
        }
        return null; // Skip non-MP3 files or those without unregUserId in the title
      })
    );
    const cleanedTitleSongs = files.map((s) =>
      s.title
        .replace(new RegExp(`^${unregUserId}-`), "") // Remove the prefix + suffix
        .replace(/\.mp3$/, "")
    );

    res.json({
      plTitle: "Your Playlist 💕",
      songs: files.filter(Boolean).map((s, i) => ({
        ...s,
        title: cleanedTitleSongs[i],
      })),
    });
  } catch {
    res.status(500).json({ error: "Error listing files" });
  }
};

exports.getAllPlaylists = async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  const userEmail = req.user.email; // Get the user's email from the request

  try {
    // Find the user by email
    const user = await User.findOne({ email: userEmail }).populate("playlists"); // Populate playlists

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return all playlists associated with the user
    res.status(200).json(user.playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
