import React, { useState, useRef, useEffect } from "react";
import AudioPlayerList from "./AudioPlayerList";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [plUrl, setPlUrl] = useState(null);

  const plRef = useRef();

  const searchPL = () => {
    const link = plRef.current.value;

    if (!link) return;
    setPlUrl(link);
    fetchPL(link);
  };
  const fetchPL = async (link) => {
    setIsLoading(true);
    const apiUrl = `${process.env.REACT_APP_API_DOMAIN}/playlist/?plUrl=${link}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.ok) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <input
        ref={plRef}
        placeholder="Playlist"
        defaultValue={
          "https://youtube.com/playlist?list=PLe4G0yoIuLVWGkDFV9MuKq98GuZwncjnN"
        }
      ></input>
      <button onClick={searchPL}>Get PL</button>
      {!isLoading && plUrl && <AudioPlayerList />}
      {/* {<AudioPlayerList />} */}
    </>
  );
}

export default App;
