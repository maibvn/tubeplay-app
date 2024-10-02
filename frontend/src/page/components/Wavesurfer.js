// import React, { useEffect, useRef } from "react";
// import WaveSurfer from "wavesurfer.js";

// const Wavesurfer = () => {
//   const waveformRef = useRef(null);
//   const wavesurferRef = useRef(null);

//   const track = {
//     title: "Ida Corr - Let Me Think About It (Radio Edit)",
//     ytUrl: "https://www.youtube.com/watch?v=X5SIQkVlB4Q",
//     dropboxUrl:
//       "https://www.dropbox.com/scl/fi/e0jr9blol25irilx06p9n/123-Ida-Corr-Let-Me-Think-About-It-Radio-Edit.mp3?rlkey=6s4ctl5n1mls2bm55zoq4qhps&dl=1",
//     thumbnail: {
//       url: "https://i.ytimg.com/vi/X5SIQkVlB4Q/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAH4ReLrHn6t10jG2TJufNyLEqPzw",
//       width: 336,
//       height: 188,
//     },
//   };

//   //   useEffect(() => {
//   //     // Initialize Wavesurfer when the component mounts
//   //     if (waveformRef.current) {
//   //       wavesurferRef.current = WaveSurfer.create({
//   //         container: waveformRef.current,
//   //         waveColor: "#ddd",
//   //         progressColor: "#4a90e2",
//   //         backend: "MediaElement", // Use HTML5 audio element
//   //         height: 100,
//   //       });
//   //       const dropboxUrl = `${
//   //         process.env.REACT_APP_API_DOMAIN
//   //       }/proxy?url=${encodeURIComponent(track.dropboxUrl)}`;

//   //       // Load the audio file from Dropbox
//   //       wavesurferRef.current.load(dropboxUrl);
//   //       //   wavesurferRef.current.load(track.dropboxUrl);

//   //       // Cleanup Wavesurfer instance when the component unmounts
//   //       return () => wavesurferRef.current.destroy();
//   //     }
//   //   }, []);
//   useEffect(() => {
//     // Initialize Wavesurfer when the component mounts
//     if (waveformRef.current) {
//       wavesurferRef.current = WaveSurfer.create({
//         container: waveformRef.current,
//         waveColor: "#ddd",
//         progressColor: "#4a90e2",
//         backend: "MediaElement", // Use HTML5 audio element
//         height: 100,
//       });

//       const dropboxUrl = `${
//         process.env.REACT_APP_API_DOMAIN
//       }/proxy?url=${encodeURIComponent(track.dropboxUrl)}`;

//       // Load the audio file from Dropbox
//       wavesurferRef.current.load(dropboxUrl);

//       // Listen for errors during loading
//       wavesurferRef.current.on("error", (error) => {
//         console.error("Wavesurfer error:", error);
//       });

//       // Cleanup Wavesurfer instance when the component unmounts
//       return () => {
//         if (wavesurferRef.current) {
//           wavesurferRef.current.destroy();
//         }
//       };
//     }
//   }, []);

//   const playPause = () => {
//     if (wavesurferRef.current) {
//       wavesurferRef.current.playPause();
//     }
//   };

//   return (
//     <div>
//       <div>
//         {/* <img
//           src={track.thumbnail.url}
//           alt={track.title}
//           width={track.thumbnail.width}
//           height={track.thumbnail.height}
//         /> */}
//         <h3>{track.title}</h3>
//       </div>
//       <div ref={waveformRef} style={{ width: "100%", height: "100px" }} />
//       <button onClick={playPause}>Play / Pause</button>
//     </div>
//   );
// };

// export default Wavesurfer;
