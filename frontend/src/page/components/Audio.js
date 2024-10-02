import React, { useRef, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faRandom,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Audio.module.css";

const Audio = ({ playlist }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [isLoopMode, setIsLoopMode] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState(playlist.songs);
  const audioRefs = useRef([]);

  const playAudio = (index) => {
    audioRefs.current.forEach((audio, idx) => {
      if (audio && idx !== index) {
        audio.pause();
        audio.currentTime = 0;
        setProgress((prev) => {
          const newProgress = [...prev];
          newProgress[idx] = 0;
          return newProgress;
        });
      }
    });

    const currentAudio = audioRefs.current[index];
    if (currentAudio) {
      if (currentAudio.paused) {
        currentAudio
          .play()
          .then(() => {
            setIsPlaying(true);
            setCurrentTrackIndex(index);
          })
          .catch((error) => console.error("Audio play error: ", error));
      } else {
        currentAudio.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const currentAudio = audioRefs.current[currentTrackIndex];
    const handleEnded = () => {
      const nextIndex = (currentTrackIndex + 1) % shuffledPlaylist.length;
      if (nextIndex !== 0 || isLoopMode) playAudio(nextIndex);
    };

    currentAudio?.addEventListener("ended", handleEnded);
    return () => currentAudio?.removeEventListener("ended", handleEnded);
  }, [currentTrackIndex, shuffledPlaylist, isLoopMode]);

  const handleTimeUpdate = (index, audio) => {
    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[index] = (audio.currentTime / audio.duration) * 100;
      return newProgress;
    });
  };

  const toggleShuffle = useCallback(() => {
    setShuffledPlaylist((prev) =>
      isShuffleMode
        ? playlist.songs
        : [...playlist.songs].sort(() => Math.random() - 0.5)
    );
    setIsShuffleMode((prev) => !prev);
    setCurrentTrackIndex(0);
  }, [isShuffleMode, playlist.songs]);

  return (
    <div>
      <div
        style={{ textAlign: "center", marginBottom: "20px", display: "flex" }}
      >
        <button
          onClick={() => playAudio(currentTrackIndex)}
          className={`${styles.controlButton} ${
            isPlaying ? styles.active : styles.inactive
          }`}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button
          onClick={toggleShuffle}
          className={`${styles.controlButton} ${
            isShuffleMode ? styles.active : styles.inactive
          }`}
        >
          <FontAwesomeIcon icon={faRandom} />
        </button>
        <button
          onClick={() => setIsLoopMode((prev) => !prev)}
          className={`${styles.controlButton} ${
            isLoopMode ? styles.active : styles.inactive
          }`}
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>

      <ul className={styles.audioList}>
        {shuffledPlaylist.map((song, index) => (
          <li
            key={index}
            className={`${styles.listItem} ${
              index === currentTrackIndex ? styles.activeTrack : ""
            }`}
            onClick={() => playAudio(index)}
          >
            <div
              className={styles.progressBar}
              style={{
                width: `${progress[index]}%`,
                display: currentTrackIndex === index ? "block" : "none",
              }}
            />
            <div className={styles.songInfo}>
              <img
                src={song.thumbnail.url}
                style={{ width: "100px", zIndex: 2 }}
                alt={song.title}
              />
              <h4
                className={styles.songTitle}
                style={{
                  zIndex: 2,
                  color: index !== currentTrackIndex ? "black" : "white",
                }}
              >
                {song.title}
              </h4>
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.dropboxUrl}
                onTimeUpdate={() =>
                  handleTimeUpdate(index, audioRefs.current[index])
                }
                style={{ display: "none" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Audio;
// import React, { useRef, useState, useEffect, useCallback } from "react";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faPlay,
//   faPause,
//   faRandom,
//   faRedo,
// } from "@fortawesome/free-solid-svg-icons";

// const Audio = ({ playlist }) => {
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const [progress, setProgress] = useState([]); // Track progress
//   const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state
//   const [isShuffleMode, setIsShuffleMode] = useState(false); // Shuffle mode toggle
//   const [shuffledPlaylist, setShuffledPlaylist] = useState(playlist.songs); // Shuffled songs
//   const [isLoopMode, setIsLoopMode] = useState(false); // Loop mode toggle
//   const audioRefs = useRef([]);

//   // Play or pause audio
//   const playAudio = (index) => {
//     // Pause all other audio tracks and reset their progress
//     audioRefs.current.forEach((audio, idx) => {
//       if (audio && idx !== index && !audio.paused) {
//         audio.pause();
//         audio.currentTime = 0;
//         setProgress((prev) => {
//           const newProgress = [...prev];
//           newProgress[idx] = 0;
//           return newProgress;
//         });
//       }
//     });

//     const currentAudio = audioRefs.current[index];

//     if (currentAudio) {
//       if (currentAudio.paused) {
//         currentAudio
//           .play()
//           .then(() => {
//             setIsPlaying(true);
//             setCurrentTrackIndex(index);
//           })
//           .catch((error) => {
//             console.error("Audio play error: ", error);
//           });
//       } else {
//         currentAudio.pause();
//         setIsPlaying(false);
//       }
//     }
//   };

//   // // Play or pause audio
//   // const playAudio = (index) => {
//   //   audioRefs.current.forEach((audio, idx) => {
//   //     if (audio && idx !== index) {
//   //       audio.pause();
//   //       audio.currentTime = 0;
//   //       setProgress((prev) => {
//   //         const newProgress = [...prev];
//   //         newProgress[idx] = 0;
//   //         return newProgress;
//   //       });
//   //     }
//   //   });

//   //   const currentAudio = audioRefs.current[index];
//   //   if (currentAudio.paused) {
//   //     currentAudio.play();
//   //     setIsPlaying(true);
//   //   } else {
//   //     currentAudio.pause();
//   //     setIsPlaying(false);
//   //   }
//   //   setCurrentTrackIndex(index);
//   // };

//   // Automatically play next song when the current one ends
//   useEffect(() => {
//     const currentAudio = audioRefs.current[currentTrackIndex];
//     if (currentAudio) {
//       const handleEnded = () => {
//         const nextIndex = (currentTrackIndex + 1) % shuffledPlaylist.length;

//         if (nextIndex === 0 && !isLoopMode) {
//           return;
//         }
//         playAudio(nextIndex);
//       };
//       currentAudio.addEventListener("ended", handleEnded);
//       return () => currentAudio.removeEventListener("ended", handleEnded);
//     }
//   }, [currentTrackIndex, shuffledPlaylist]);

//   // Handle audio progress update
//   const handleTimeUpdate = (index, audio) => {
//     setProgress((prev) => {
//       const newProgress = [...prev];
//       newProgress[index] = (audio.currentTime / audio.duration) * 100;
//       return newProgress;
//     });
//   };
//   // Stop all audio
//   const stopAllAudio = () => {
//     audioRefs.current.forEach((audio) => {
//       if (audio) {
//         audio.pause();
//         audio.currentTime = 0;
//       }
//     });
//   };

//   // Shuffle/Unshuffle the playlist
//   const toggleShuffle = useCallback(() => {
//     stopAllAudio();
//     setIsPlaying(false);
//     if (isShuffleMode) {
//       setShuffledPlaylist(playlist.songs); // Reset to original order
//     } else {
//       const shuffled = [...playlist.songs].sort(() => Math.random() - 0.5);
//       setShuffledPlaylist(shuffled);
//     }
//     setIsShuffleMode((prev) => !prev);
//     setCurrentTrackIndex(0); // Reset to first song
//     // playAudio(0); // Play first song
//   }, [isShuffleMode, playlist.songs]);

//   // Toggle loop mode
//   const toggleLoop = () => {
//     // stopAllAudio();
//     setIsLoopMode((prev) => !prev);
//   };
//   return (
//     <div>
//       {/* Control Buttons */}
//       <div
//         style={{ textAlign: "center", marginBottom: "20px", display: "flex" }}
//       >
//         <button
//           onClick={() => playAudio(currentTrackIndex)}
//           style={{
//             width: "4rem",
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             fontSize: "30px",
//             color: isPlaying ? "#BB2D3B" : "grey",
//           }}
//         >
//           <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="2x" />
//         </button>
//         <button
//           onClick={toggleShuffle}
//           style={{
//             width: "4rem",
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             fontSize: "30px",
//             color: isShuffleMode ? "#BB2D3B" : "grey",
//           }}
//         >
//           <FontAwesomeIcon icon={faRandom} size="2x" />
//         </button>
//         <button
//           onClick={toggleLoop}
//           style={{
//             width: "4rem",
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             fontSize: "30px",
//             // color: isLoopMode ? "#BB2D3B" : "grey",
//           }}
//         >
//           <FontAwesomeIcon
//             icon={faRedo}
//             size="2x"
//             color={isLoopMode ? "#BB2D3B" : "grey"}
//           />
//         </button>
//       </div>

//       {/* Playlist */}
//       <ul className="list-group">
//         {shuffledPlaylist.map((song, index) => (
//           <li
//             key={index}
//             className="list-group-item p-4"
//             style={{
//               position: "relative",
//               backgroundColor:
//                 index === currentTrackIndex ? "black" : "#C1C1C1",
//               cursor: "pointer",
//             }}
//             onClick={() => playAudio(index)}
//           >
//             {/* Progress bar */}
//             <div
//               style={{
//                 position: "absolute",
//                 display: currentTrackIndex === index ? "block" : "none",
//                 top: 0,
//                 left: 0,
//                 bottom: 0,
//                 backgroundColor: "orange",
//                 width: `${progress[index]}%`,
//                 height: "100%",
//                 zIndex: 1,
//                 transition: "width 0.1s linear",
//               }}
//             ></div>

//             {/* Song info */}
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <img
//                 src={song.thumbnail.url}
//                 style={{ width: "100px", zIndex: 2 }}
//                 alt={song.title}
//               />
//               <h4
//                 style={{
//                   zIndex: 2,
//                   marginLeft: "10px",
//                   flexGrow: 1,
//                   color: index !== currentTrackIndex ? "black" : "white",
//                 }}
//               >
//                 {song.title}
//               </h4>

//               <audio
//                 ref={(el) => (audioRefs.current[index] = el)}
//                 src={song.dropboxUrl}
//                 onTimeUpdate={() =>
//                   handleTimeUpdate(index, audioRefs.current[index])
//                 }
//                 style={{ display: "none" }} // Hide audio controls
//               />
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Audio;
