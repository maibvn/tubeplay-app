const { getPlaylistUrl } = require("../utils/getPlayList");
const { uploadToDropbox } = require("../utils/uploadToDropbox");

// Dummy function to get playlists
exports.getPlaylist = (req, res) => {
  // Call this function with the authorization code you got from Dropbox
  const playlistUrl = req.query.plUrl;

  getPlaylistUrl(playlistUrl)
    .then(({ urls, songInfo }) => {
      const promises = urls.map((url, i) => {
        const dropboxPath = `/test/${songInfo[i].title.replace(
          /\s+/g,
          ""
        )}.mp3`;
        // Upload Audio
        return uploadToDropbox(url, dropboxPath, req);
      });
      return Promise.all(promises);
    })
    .then(() => {
      res.status(200).json({ message: "Success" });
    })
    .catch((err) => {
      console.error("Error processing playlist:", err);
      res
        .status(500)
        .json({ message: "Error processing playlist", error: err });
    });
};

// Dummy function to add a song to a playlist
exports.getAllSongs = async (req, res) => {
  const dbx = req.dbx;
  const folderPath = "/test"; // Replace with your folder path in Dropbox

  try {
    // List folder contents
    const response = await dbx.filesListFolder({ path: folderPath });

    // Map entries to include filename and a streaming URL for each song
    const files = await Promise.all(
      response.result.entries.map(async (entry) => {
        if (entry[".tag"] === "file" && entry.name.endsWith(".mp3")) {
          // Only handle MP3 files
          try {
            // Check if a shared link already exists for the file
            const sharedLinkResponse = await dbx.sharingListSharedLinks({
              path: entry.path_lower,
              direct_only: true, // Get direct links only (not folders)
            });

            let sharedLink;
            if (sharedLinkResponse.result.links.length > 0) {
              // Use the existing shared link
              sharedLink = sharedLinkResponse.result.links[0].url.replace(
                "dl=0",
                "raw=1"
              );
            } else {
              // Create a new shared link if none exists for the file
              const newSharedLinkResponse =
                await dbx.sharingCreateSharedLinkWithSettings({
                  path: entry.path_lower,
                });
              sharedLink = newSharedLinkResponse.result.url.replace(
                "dl=0",
                "raw=1"
              );
            }
            // Return file name and streaming URL
            return {
              name: entry.name,
              streamingUrl: sharedLink,
            };
          } catch (linkError) {
            console.error(
              "Error creating/fetching shared link for file:",
              linkError
            );
            return {
              name: entry.name,
              streamingUrl: null, // Handle missing links as needed
            };
          }
        } else {
          return null; // Skip non-MP3 files
        }
      })
    );

    // Filter out any null results (for non-MP3 files)
    const validFiles = files.filter((file) => file !== null);

    res.json(validFiles); // Send the array of objects (filename and streaming URL)
  } catch (error) {
    console.error("Error listing files from Dropbox:", error);
    res.status(500).json({ error: "Error listing files" });
  }
};
