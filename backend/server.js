const express = require("express");
const ytdl = require("@distube/ytdl-core");
const ytpl = require("ytpl");
const fs = require("fs-extra");
const path = require("path");
const { PassThrough } = require("stream");
// const ffmpeg = require("fluent-ffmpeg");
const ffmpeg = require("ffmpeg");
const cors = require("cors");
const outputDir = path.join(__dirname, "downloads");
// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
// Endpoint to list all MP3 files
app.get("/files", (req, res) => {
  fs.readdir(outputDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Error reading directory" });
    }
    const mp3Files = files.filter((file) => file.endsWith(".mp3"));
    res.json(mp3Files);
  });
});

// Endpoint to stream a specific MP3 file
app.get("/files/:filename", (req, res) => {
  const filePath = path.join(outputDir, req.params.filename);
  res.sendFile(filePath);
});

// Endpoint to start the process
const downloadAudio = async (url, title, next) => {
  const outputFilePath = path.join(outputDir, `${title}.mp3`);

  if (fs.existsSync(outputFilePath)) {
    return next();
  }
  // Download and save the audio
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, { filter: "audioonly" }).pipe(
      fs.createWriteStream(outputFilePath)
    );

    stream.on("finish", () => {
      console.log(`${title}.mp3 has been downloaded.`);
      resolve(); // Resolve the promise on successful download
    });

    stream.on("error", (err) => {
      console.error(`Error downloading ${title}:`, err);
      reject(err); // Reject the promise if there's an error
    });
  });
};

async function getPlaylistUrls(playlistUrl) {
  try {
    // Fetch playlist details
    const playlist = await ytpl(playlistUrl);

    // Extract video URLs
    const urls = playlist.items.map((item) => item.shortUrl);

    return { urls };
  } catch (error) {
    console.error("Error fetching playlist:", error);
  }
}
app.get("/", (req, res, next) => {
  const playlistUrl =
    "https://www.youtube.com/playlist?list=PLe4G0yoIuLVUwu5ypCniPGC6fn2-S4uP2"; // Replace with your playlist URL

  getPlaylistUrls(playlistUrl)
    .then(({ urls }) => {
      const promises = urls.map((url, i) => {
        const title = `abc${i}`;
        return downloadAudio(url, title, next);
      });

      // Wait for all downloads to finish
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
