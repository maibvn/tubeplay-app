import React, { useState, useRef, useEffect } from "react";
import AudioPlayer from "./AudioPlayerList";
import AudioPlayerList from "./AudioPlayerList";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPL = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_DOMAIN}/`);
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
    fetchPL();
  }, []);
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {!isLoading && <AudioPlayerList />}
    </>
  );
}

export default App;
