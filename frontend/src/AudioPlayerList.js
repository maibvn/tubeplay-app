import React, { useEffect, useState } from "react";

const dummy_files = [
  "https://www.dropbox.com/scl/fi/cpd7gw7q8h1vlcc3e5a0i/ArminvanBuurenfeat.SharondenAdel-InAndOutOfLove-OfficialMusicVideo.mp3?rlkey=smi7df2ynd0xcs6e8u73h8ofn&st=9t7m2t3n&dl=1",
  "https://www.dropbox.com/scl/fi/1usg55xpnfff5bmya2k70/IdaCorr-LetMeThinkAboutIt-RadioEdit.mp3?rlkey=04w0nbilt23ko66da7mdckbdv&st=xznakcgm&dl=1",
  "https://www.dropbox.com/scl/fi/50dnbxjt6nkwsjttkb586/LadyGaga-BrunoMars-DieWithASmile-OfficialMusicVideo.mp3?rlkey=6x6z55yexu2nxzdkmnjg5nc06&st=fdxzp5j0&dl=1",
  "https://www.dropbox.com/scl/fi/hl8gozbvj5atvse23waj2/MichaelJackson-BillieJean-NickShadesRemix-TechHouse.mp3?rlkey=7i1s5huo5dptt442o9de4kshn&st=ea27kggf&dl=1",
  "https://www.dropbox.com/scl/fi/t6n50bmyp5z3ipers03qy/WhoDaFunk-ShinyDiscoBalls-MainMix-TonyMendesVideoReEdit.mp3?rlkey=q50h4tkiksf8io2dzb0tm9de2&st=jxczclyi&dl=1",
  "https://www.dropbox.com/scl/fi/j6eax9uqinpgljftonwbd/Yaelokre-HarpyHare-Lyrics.mp3?rlkey=72taiq4wjr9fvuqwxhholsb1v&st=td3jxzdl&dl=1",
];

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
              <h3>Song: {index + 1}</h3>
              <audio controls autoPlay={index === 0}>
                <source src={file} type="audio/mpeg" />
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
