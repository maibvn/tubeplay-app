// import React, { useEffect, useRef, useState } from "react";
// import WaveSurfer from "wavesurfer.js";

// const Playlist = ({ playlist }) => {
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const [isReady, setIsReady] = useState(false); // Track user interaction
//   const wavesurferRef = useRef(null);

//   useEffect(() => {
//     if (playlist.songs.length > 0) {
//       // Initialize Wavesurfer instance
//       wavesurferRef.current = WaveSurfer.create({
//         container: "#waveform",
//         waveColor: "#D9DCFF",
//         progressColor: "#4353FF",
//         barWidth: 5,
//         cursorWidth: 1,
//         height: 50,
//         normalize: true,
//         backend: "MediaElement",
//       });

//       // Load the first track
//       loadTrack(currentTrackIndex);

//       // Listen for the finish event to autoplay next song
//       wavesurferRef.current.on("finish", handleNextTrack);

//       // Error handling for Wavesurfer
//       wavesurferRef.current.on("error", (err) => {
//         console.error("Wavesurfer error:", err);
//         alert(
//           "There was an error with loading the audio file. Please try again."
//         );
//       });

//       return () => {
//         if (wavesurferRef.current) {
//           try {
//             // Pause before destroy to avoid potential abort errors
//             wavesurferRef.current.pause();
//             wavesurferRef.current.destroy();
//           } catch (error) {
//             console.error("Error during Wavesurfer destruction:", error);
//           }
//         }
//       };
//     }
//   }, [currentTrackIndex]);

//   const loadTrack = (index) => {
//     const currentSong = playlist.songs[index];

//     const dropboxUrl = `${
//       process.env.REACT_APP_API_DOMAIN
//     }/proxy?url=${encodeURIComponent(currentSong.dropboxUrl)}`;

//     if (wavesurferRef.current) {
//       try {
//         wavesurferRef.current.load(dropboxUrl);
//         if (isReady) {
//           wavesurferRef.current.play(); // Play if user has interacted with the page
//         }
//       } catch (error) {
//         console.error("Error loading track:", error);
//       }
//     }
//   };

//   const handleNextTrack = () => {
//     const nextIndex = (currentTrackIndex + 1) % playlist.songs.length;
//     setCurrentTrackIndex(nextIndex);
//   };

//   const handleTrackClick = (index) => {
//     setCurrentTrackIndex(index);
//   };

//   const handlePlayButton = () => {
//     setIsReady(true); // Set that user has interacted
//     wavesurferRef.current.play(); // Start playing the current track
//   };

//   return (
//     <div>
//       <ul className="list-group">
//         {playlist.songs.map((file, index) => (
//           <li
//             key={index}
//             className={`list-group-item p-4 ${
//               index === currentTrackIndex ? "active" : ""
//             }`}
//             onClick={() => handleTrackClick(index)}
//           >
//             <h3>{file.title}</h3>
//           </li>
//         ))}
//       </ul>

//       <div id="waveform"></div>

//       {/* Play button to start the playlist, requires user interaction */}
//       {!isReady && (
//         <button onClick={handlePlayButton} className="btn btn-primary mt-3">
//           Play
//         </button>
//       )}
//     </div>
//   );
// };

// export default Playlist;
