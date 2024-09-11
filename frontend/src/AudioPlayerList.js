import React, { useEffect, useState } from "react";

const AudioPlayerList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the list of MP3 files from the backend
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_DOMAIN}/files`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setFiles(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFiles();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Audio Playlist</h1>
      {files.length === 0 && isLoading ? (
        <p>No audio files found</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={file}>
              <h3>{file}</h3>
              <audio controls autoPlay={index === 0}>
                <source
                  src={`${process.env.REACT_APP_API_DOMAIN}/files/${file}`}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AudioPlayerList;
