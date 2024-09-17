require("dotenv").config();
const express = require("express");
const ytdl = require("@distube/ytdl-core");
const ytpl = require("ytpl");
const cors = require("cors");
const { Dropbox } = require("dropbox");
const fetch = require("node-fetch");
const { Readable } = require("stream");

const port = process.env.PORT || 5000;

const app = express();

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

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch: fetch,
});

// GET ACCESS TOKEN
const clientId = process.env.DROPBOX_ID;
const clientSecret = process.env.DROPBOX_SECRET;
const redirectUri = "http://localhost:5000"; // Must match with your Dropbox app settings

// // Route to generate and display the Dropbox OAuth authorization URL
// app.get("/auth", (req, res) => {
//   const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
//     redirectUri
//   )}`;
//   res.send(`<a href="${authUrl}">Authorize App with Dropbox</a>`);
// });
// Redirect URI route to receive the authorization code
app.get("/", async (req, res) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.send("No authorization code received");
  }

  try {
    // Exchange the authorization code for an access token and refresh token
    const response = await axios.post(
      "https://api.dropboxapi.com/oauth2/token",
      qs.stringify({
        code: authorizationCode,
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    res.send(`
      <h1>Tokens Received</h1>
      <p>Access Token: ${access_token}</p>
      <p>Refresh Token: ${refresh_token}</p>
      <p>Expires In: ${expires_in} seconds</p>
    `);

    console.log("Access Token:", access_token);
    console.log("Refresh Token:", refresh_token); // Store this securely for future use
    console.log("Expires In:", expires_in);
  } catch (error) {
    console.error("Error fetching tokens:", error.response.data);
    res.send("Error fetching tokens");
  }
});
// Endpoint to list all MP3 files
app.get("/files", async (req, res) => {
  const folderPath = "/test"; // Replace with your folder path in Dropbox

  try {
    // List folder contents
    const response = await dbx.filesListFolder({ path: folderPath });
    const files = response.result.entries.map((entry) => ({
      path_lower: entry.path_lower,
      name: entry.name,
    }));

    const file = files.map((f) => f.name);
    res.json(file);
  } catch (error) {
    console.error("Error listing files from Dropbox:", error);
    res.status(500).json({ error: "Error listing files" });
  }
});
// Endpoint to stream MP3 files from Dropbox
app.get("/files/:filename", async (req, res) => {
  const { filename } = req.params;
  const dropboxPath = `/test/${filename}`;

  try {
    // Get the file metadata to check if it exists
    await dbx.filesGetMetadata({ path: dropboxPath });

    // Download the file
    const response = await dbx.filesDownload({ path: dropboxPath });

    // Get file content as a buffer
    const fileContent = response.result.fileBinary;

    // Set the appropriate content type
    res.setHeader("Content-Type", "audio/mpeg");

    // Convert buffer to a stream and pipe it to the response
    const fileStream = bufferToStream(fileContent);
    fileStream.pipe(res);
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error("Conflict error:", error);
      res.status(409).json({ error: "File conflict or path issue" });
    } else {
      console.error("Error streaming file from Dropbox:", error);
      res.status(500).json({ error: "Error streaming file" });
    }
  }
});

const uploadToDropbox = async (url, dropboxPath) => {
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
