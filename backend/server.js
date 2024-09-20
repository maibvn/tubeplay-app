require("dotenv").config();
const express = require("express");
const ytdl = require("@distube/ytdl-core");
const ytpl = require("ytpl");
const cors = require("cors");
const { Dropbox } = require("dropbox");
const fetch = require("node-fetch");
const { Readable } = require("stream");
// const getAccessToken = require("./utils/getAccessToken");
const connectDB = require("./utils/connectDB");
const initializeDropbox = require("./utils/refreshAccessToken");
// const { dbx, refreshAccessToken } = require("./utils/refreshAccessToken");

connectDB();

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
// const dbx = new Dropbox({
//   accessToken: process.env.DROPBOX_ACCESS_TOKEN,
//   fetch: fetch,
// });
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

// Utility function to convert binary data to a readable stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// // Endpoint to list all MP3 files
app.get("/files", async (req, res) => {
  const folderPath = "/test"; // Replace with your folder path in Dropbox

  try {
    // List folder contents
    const response = await dbx.filesListFolder({ path: folderPath });

    // Map entries to include filename and streaming URL
    const files = await Promise.all(
      response.result.entries.map(async (entry) => {
        try {
          // Check if a shared link already exists
          const sharedLinkResponse = await dbx.sharingListSharedLinks({
            path: entry.path_lower,
          });

          let sharedLink;
          if (sharedLinkResponse.result.links.length > 0) {
            // Use the existing shared link
            sharedLink = sharedLinkResponse.result.links[0].url.replace(
              "dl=0",
              "raw=1"
            );
          } else {
            // Create a new shared link if none exists
            const newSharedLinkResponse =
              await dbx.sharingCreateSharedLinkWithSettings({
                path: entry.path_lower,
              });
            sharedLink = newSharedLinkResponse.result.url.replace(
              "dl=0",
              "raw=1"
            );
          }

          return {
            name: entry.name,
            streamingUrl: sharedLink,
          };
        } catch (linkError) {
          console.error("Error creating/fetching shared link:", linkError);
          return {
            name: entry.name,
            streamingUrl: null, // Set to null or handle as needed
          };
        }
      })
    );

    res.json(files); // Send the array of objects
  } catch (error) {
    console.error("Error listing files from Dropbox:", error);
    res.status(500).json({ error: "Error listing files" });
  }
});

// app.get("/files", async (req, res) => {
//   // const dbx = new Dropbox({
//   //   accessToken: process.env.DROPBOX_ACCESS_TOKEN,
//   //   fetch: fetch,
//   // });
//   const folderPath = "/test"; // Replace with your folder path in Dropbox

//   try {
//     // List folder contents
//     const response = await dbx.filesListFolder({ path: folderPath });
//     // const files = response.result.entries.map((entry) => ({
//     //   path_lower: entry.path_lower,
//     //   name: entry.name,
//     // }));
//     const file = await Promise.all(
//       response.result.entries.map(async (entry) => {
//         const sharedLinkResponse =
//           await dbx.sharingCreateSharedLinkWithSettings({
//             path: entry.path_lower,
//           });
//         const sharedLink = sharedLinkResponse.result.url.replace(
//           "?dl=0",
//           "?raw=1"
//         ); // Change to raw link for direct streaming

//         return {
//           name: entry.name,
//           streamingUrl: sharedLink,
//         };
//       })
//     );
//     console.log(file);
//     // const file = files.map((f) => f.name);
//     res.json(file);
//   } catch (error) {
//     console.error("Error listing files from Dropbox:", error);
//     res.status(500).json({ error: "Error listing files" });
//   }
// });
// Endpoint to stream MP3 files from Dropbox
// app.get("/files/:filename", async (req, res) => {
//   const { filename } = req.params;
//   const dropboxPath = `/test/${filename}`;

//   try {
//     // Get the file metadata to check if it exists
//     await dbx.filesGetMetadata({ path: dropboxPath });

//     // Download the file
//     const response = await dbx.filesDownload({ path: dropboxPath });

//     // Get file content as a buffer
//     const fileContent = response.result.fileBinary;

//     // Set the appropriate content type
//     res.setHeader("Content-Type", "audio/mpeg");
//     // Create a readable stream from the buffer
//     const stream = new Readable();
//     stream.push(fileContent);
//     stream.push(null); // Signal that the stream has ended

//     // Pipe the stream to the response
//     stream.pipe(res);
//     // // Convert buffer to a stream and pipe it to the response
//     // const fileStream = bufferToStream(fileContent);
//     // fileStream.pipe(res);
//   } catch (error) {
//     if (error.response && error.response.status === 409) {
//       console.error("Conflict error:", error);
//       res.status(409).json({ error: "File conflict or path issue" });
//     } else {
//       console.error("Error streaming file from Dropbox:", error);
//       res.status(500).json({ error: "Error streaming file" });
//     }
//   }
// });

const uploadToDropbox = async (url, dropboxPath) => {
  return;
  return new Promise((resolve, reject) => {
    const ytdlStream = ytdl(url, { filter: "audioonly" });

    const chunks = [];
    ytdlStream.on("data", (chunk) => {
      chunks.push(chunk); // Collect chunks of data
    });

    ytdlStream.on("end", async () => {
      console.log("end yt");
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

// app.post("/auth/dropbox/token", async (req, res) => {
//   const { code, redirect_uri } = req.body; // Get the authorization code from the request body

//   getAccessToken(code, redirect_uri).then((data) => {
//     const { access_token, uid, refresh_token } = data;

//     res.sendStatus(200);
//   });
// });

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
