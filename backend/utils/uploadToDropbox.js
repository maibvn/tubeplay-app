const ytdl = require("@distube/ytdl-core");
// const ytdl = require("ytdl-core"); // Ensure you have this dependency
// const { dbx } = require("../utils/connectDB"); // Adjust the path to your Dropbox client instance

exports.uploadToDropbox = async (url, dropboxPath, req) => {
  const dbx = req.dbx;
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
      console.log(
        `File with the name ${fileName} already exists. Upload canceled.`
      );
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
