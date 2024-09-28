import React, { useEffect, useState } from "react";
import WaveForm from "./WaveForm";
import { useLocation } from "react-router-dom";

const AudioPlayerList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playlist, setPlaylist] = useState({ plTitle: "", songs: [] });
  const [error, setError] = useState(null);

  const location = useLocation();
  const { nonRegisterUserId, playlistId, playlistInfo } = location.state?.data;

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("tubeplay-token"));
    const unregUserId = JSON.parse(localStorage.getItem("nonRegisterUserId"));

    // Fetch the list of MP3 files from the backend
    const fetchFiles = async (url) => {
      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setPlaylist(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };

    if (unregUserId && playlistInfo) {
      // User has not signed in -- create 1 playlist only
      setPlaylist(playlistInfo);
    } else if (unregUserId && !playlistId) {
      // Fetch folder /temp
      const url = `${process.env.REACT_APP_API_DOMAIN}/api/playlist/temp/${unregUserId}`;
      fetchFiles(url);
    } else {
      // User has signed in
      const url = `${process.env.REACT_APP_API_DOMAIN}/api/playlist/${playlistId}`;
      fetchFiles(url);
    }
  }, []);

  // const audioUrl =
  //   "https://www.dropbox.com/scl/fi/hymyf52gduklor3kk25w4/ArminvanBuurenfeat.SharondenAdel-InAndOutOfLove-OfficialMusicVideo.mp3?rlkey=h0umw2pbdbb55d6ax9mcturk5&st=c8kncu9u&dl=1";

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="text-center text-white bg-dark">
      <h1>{playlist.plTitle}</h1>
      {playlist.songs?.length === 0 && isLoading ? (
        <p>No audio files found</p>
      ) : (
        <div className="container-fluid d-flex justify-content-center">
          <div className="row">
            <img
              src={playlist.songs[0].thumbnail?.url}
              style={{ width: "336px", height: "188px" }}
            />
            <ul className="col">
              {playlist.songs.map((file, index) => (
                <li key={Math.random()} className="list-group-item p-4">
                  <h3>{file.title}</h3>
                  <audio controls>
                    <source src={file.dropboxUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  {/* <WaveForm audioUrl={audioUrl} /> */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayerList;
