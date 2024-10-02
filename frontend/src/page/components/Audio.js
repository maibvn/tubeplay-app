import React, { useRef, useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRandom } from "@fortawesome/free-solid-svg-icons";

const Audio = ({ playlist }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState([]); // Store audio progress for each song
  const [isPlaying, setIsPlaying] = useState(false); // Track if current audio is playing
  const [isShuffleMode, setIsShuffleMode] = useState(false); // Toggle shuffle mode
  const [shuffledPlaylist, setShuffledPlaylist] = useState(playlist.songs); // Shuffled playlist
  const audioRefs = useRef([]);

  // Function to play audio
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
        currentAudio.play();
        setIsPlaying(true);
      } else {
        currentAudio.pause();
        setIsPlaying(false);
      }
      setCurrentTrackIndex(index);
    }
  };

  // Auto-play the next song when the current song ends
  useEffect(() => {
    const currentAudio = audioRefs.current[currentTrackIndex];
    if (currentAudio) {
      currentAudio.addEventListener("ended", () => {
        const nextIndex = (currentTrackIndex + 1) % shuffledPlaylist.length;
        playAudio(nextIndex);
      });
    }
    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener("ended", () => {});
      }
    };
  }, [currentTrackIndex, shuffledPlaylist]);

  // Handle time update for progress
  const handleTimeUpdate = (index, audio) => {
    if (audio) {
      const progressPercentage = (audio.currentTime / audio.duration) * 100;
      setProgress((prev) => {
        const newProgress = [...prev];
        newProgress[index] = progressPercentage;
        return newProgress;
      });
    }
  };

  // Shuffle the playlist
  const shufflePlaylist = useCallback(() => {
    const shuffled = [...playlist.songs].sort(() => Math.random() - 0.5);
    setShuffledPlaylist(shuffled);
    setIsShuffleMode(true);
    setCurrentTrackIndex(0); // Reset to the first song of the shuffled playlist
    playAudio(0); // Play the first shuffled track
  }, [playlist.songs]);

  return (
    <div>
      {/* Shuffle button */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={shufflePlaylist}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "30px",
            color: "#BB2D3B",
          }}
        >
          <FontAwesomeIcon icon={faRandom} size="3x" />
        </button>
      </div>

      <ul className="list-group">
        {shuffledPlaylist.map((song, index) => (
          <li
            key={index}
            className="list-group-item p-4"
            style={{
              position: "relative",
              backgroundColor:
                index === currentTrackIndex ? "black" : "#C1C1C1",
              cursor: "pointer",
            }}
            onClick={() => playAudio(index)}
          >
            {/* Progress bar div behind the content */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                backgroundColor: "orange",
                width: `${progress[index]}%`,
                height: "100%",
                zIndex: 1,
                transition: "width 0.1s linear",
              }}
            ></div>
            {/* Content div */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                position: "relative",
                zIndex: 2,
              }}
            >
              <img
                src={song.thumbnail.url}
                style={{ width: "100px" }}
                alt={song.title}
              />
              <h4
                style={{
                  marginLeft: "10px",
                  flexGrow: 1,
                  color: index !== currentTrackIndex ? "black" : "white",
                }}
              >
                {song.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(index);
                }}
                style={{
                  marginLeft: "10px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {/* <FontAwesomeIcon
                  icon={
                    isPlaying && currentTrackIndex === index ? faPause : faPlay
                  }
                /> */}
              </button>
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={song.dropboxUrl}
                // autoPlay={}
                onTimeUpdate={() =>
                  handleTimeUpdate(index, audioRefs.current[index])
                }
                style={{ display: "none" }} // Hide the default audio controls
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Audio;
