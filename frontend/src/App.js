import React from "react";
import AudioPlayerList from "./AudioPlayerList";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
function App() {
  // xong mỗi khi anh làm gì xong anh push code lên là đc nha
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* {!isLoading && plUrl && <AudioPlayerList />} */}
        <Route path="/playlist" element={<AudioPlayerList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
