import React, { useState, useRef, useEffect } from "react";
import AudioPlayer from "./AudioPlayerList";
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
      // setError(error.message);
    }
  };
  // useEffect(() => {
  //   // fetchPL();
  // }, []);
  return (
    <>
      <input ref={plRef} placeholder="Playlist"></input>
      <button onClick={searchPL}>Get PL</button>
      {/* {isLoading && plRef && <div>Loading...</div>} */}
      {!isLoading && plUrl && <AudioPlayerList />}
    </>
  );
}

export default App;
