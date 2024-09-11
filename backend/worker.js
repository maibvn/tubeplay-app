// const { parentPort, workerData } = require("worker_threads");
// const ytdl = require("ytdl-core");
// const ffmpeg = require("fluent-ffmpeg");

// // Function to convert audio stream to MP3
// const convertToMP3 = async (url) => {
//   try {
//     const info = await ytdl.getInfo(url);
//     const audioFormat = ytdl.chooseFormat(info.formats, {
//       filter: "audioonly",
//       quality: "highestaudio",
//     });
//     return new Promise((resolve, reject) => {
//       ffmpeg(ytdl.downloadFromInfo(info, { format: audioFormat }))
//         .toFormat("mp3")
//         .on("error", reject)
//         .on("end", () => resolve("Conversion successful"))
//         .save(workerData.audioPath);
//     });
//   } catch (error) {
//     throw new Error("Failed to convert audio stream to MP3");
//   }
// };

// // Handle message from parent thread
// parentPort.on("message", async (url) => {
//   try {
//     const result = await convertToMP3(url);
//     parentPort.postMessage(result);
//   } catch (error) {
//     parentPort.postMessage({ error: error.message });
//   }
// });
