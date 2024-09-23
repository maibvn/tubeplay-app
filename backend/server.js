require("dotenv").config();
const express = require("express");
const ytdl = require("@distube/ytdl-core");
const ytpl = require("ytpl");
const cors = require("cors");
const connectDB = require("./utils/connectDB");
const initializeDropbox = require("./utils/refreshAccessToken");

// DATABASE
connectDB();

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());

// DROPBOX
let dbx; // Declare dbx globally

// Function to initialize Dropbox client
async function init() {
  try {
    dbx = await initializeDropbox(); // Initialize dbx globally
    console.log("Dropbox client initialized successfully");
  } catch (error) {
    console.error("Error initializing Dropbox client:", error);
  }
}

// Call the init function to set up the Dropbox client
init();
// app.use(cors());
app.use(
  cors({
    origin: "*", // Adjust according to your needs (e.g., specify allowed origins)
  })
);

app.get("/files", async (req, res) => {
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
});

const uploadToDropbox = async (url, dropboxPath) => {
  // Extract the file name from the dropboxPath
  const fileName = dropboxPath.split("/").pop();

  try {
    // List files in the folder to check for existence
    const folderPath = dropboxPath.substring(0, dropboxPath.lastIndexOf("/")); // Get the folder path
    const response = await dbx.filesListFolder({ path: folderPath });

    // Check if any file has the same name
    const fileExists = response.result.entries.some(
      (entry) => entry.name === fileName
    );

    if (fileExists) {
      // console.log(
      //   `File with the name ${fileName} already exists. Upload canceled.`
      // );
      return; // Cancel the upload
    }
  } catch (error) {
    console.error("Error checking existing files:", error);
    return; // Optionally handle the error
  }

  return new Promise((resolve, reject) => {
    const ytdlStream = ytdl(url, { filter: "audioonly" });

    const chunks = [];
    ytdlStream.on("data", (chunk) => {
      chunks.push(chunk); // Collect chunks of data
    });

    ytdlStream.on("end", async () => {
      const buffer = Buffer.concat(chunks); // Concatenate the chunks into a single buffer

      try {
        // Upload the buffer to Dropbox
        const response = await dbx.filesUpload({
          path: dropboxPath,
          contents: buffer,
          mode: { ".tag": "add" },
        });
        console.log(`File uploaded to Dropbox at: ${dropboxPath}`);
        resolve(response);
      } catch (error) {
        console.error("Error uploading to Dropbox:", error);
        reject(error);
      }
    });

    ytdlStream.on("error", (err) => {
      console.error("Error downloading audio:", err);
      reject(err);
    });
  });
};

async function getPlaylistUrls(playlistUrl) {
  try {
    // Fetch playlist details
    const playlist = await ytpl(playlistUrl);

    // Extract video URLs
    const urls = playlist.items.map((item) => item.shortUrl);

    return { urls, songInfo: playlist.items };
  } catch (error) {
    console.error("Error fetching playlist:", error);
  }
}

app.get("/playlist", (req, res, next) => {
  // Call this function with the authorization code you got from Dropbox

  const playlistUrl = req.query.plUrl;

  // https://youtube.com/playlist?list=PLe4G0yoIuLVWGkDFV9MuKq98GuZwncjnN
  // const playlistUrl =
  //   "https://www.youtube.com/playlist?list=PLe4G0yoIuLVUwu5ypCniPGC6fn2-S4uP2"; // Replace with your playlist URL

  getPlaylistUrls(playlistUrl)
    .then(({ urls, songInfo }) => {
      const promises = urls.map((url, i) => {
        const dropboxPath = `/test/${songInfo[i].title.replace(
          /\s+/g,
          ""
        )}.mp3`;
        // Upload Audio
        return uploadToDropbox(url, dropboxPath, next);
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
});

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
