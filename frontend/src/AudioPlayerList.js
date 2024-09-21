import React, { useEffect, useState } from "react";

const dummy_files = [
  {
    name: "Song 1",
    streamingUrl:
      "https://www.dropbox.com/scl/fi/hymyf52gduklor3kk25w4/ArminvanBuurenfeat.SharondenAdel-InAndOutOfLove-OfficialMusicVideo.mp3?rlkey=h0umw2pbdbb55d6ax9mcturk5&st=c8kncu9u&dl=1",
  },
  {
    name: "Song 2",
    streamingUrl:
      "https://www.dropbox.com/scl/fi/qxploau9juo0f7pjz5hdr/IdaCorr-LetMeThinkAboutIt-RadioEdit.mp3?rlkey=pdz76jw9f1n6nu2svjl1fqanj&st=lphnfsxn&dl=1",
  },
  {
    name: "Song 3",
    streamingUrl:
      "https://www.dropbox.com/scl/fi/qxploau9juo0f7pjz5hdr/IdaCorr-LetMeThinkAboutIt-RadioEdit.mp3?rlkey=pdz76jw9f1n6nu2svjl1fqanj&st=lphnfsxn&dl=1",
  },
  {
    name: "Song 4",
    streamingUrl:
      "https://www.dropbox.com/scl/fi/iogl9oouj0q2yfv6s9idz/LadyGaga-BrunoMars-DieWithASmile-OfficialMusicVideo.mp3?rlkey=zhmsgxyfl1a9qkyfdmcxfowm8&st=v1yaipvp&dl=1",
  },
  {
    name: "Song 5",
    streamingUrl:
      "https://www.dropbox.com/scl/fi/b725ge8kvzhgl8j1cngmr/WhoDaFunk-ShinyDiscoBalls-MainMix-TonyMendesVideoReEdit.mp3?rlkey=smmszxmhve255ic51jdryyicd&st=s4prspr6&dl=1",
  },
  {
    name: "Song 6",
    streamingUrl:
      "https://www.dropbox.com/scl/fi/b725ge8kvzhgl8j1cngmr/WhoDaFunk-ShinyDiscoBalls-MainMix-TonyMendesVideoReEdit.mp3?rlkey=smmszxmhve255ic51jdryyicd&st=s4prspr6&dl=1",
  },
];

// a muốn update cả backend ko hay chỉ frontend thôi- thôi frontend thôi - a đợi e xíu
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
        console.log(data);
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
  // console.log(dummy_files);
  return (
    <div>
      <h1>Audio Playlist</h1>
      {dummy_files.length === 0 && isLoading ? (
        <p>No audio files found</p>
      ) : (
        <ul>
          {/* {files.map((file, index) => (
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
          ))} */}
          {dummy_files.map((file, index) => (
            <li key={file}>
              <h3>{file.name}</h3>
              <audio controls autoPlay={index === 0}>
                <source src={file.streamingUrl} type="audio/mpeg" />
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
