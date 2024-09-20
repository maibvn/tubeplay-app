import React, { useState, useRef, useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DropboxOAuth from "./components/DropboxOAuth";
import DropboxCallback from "./components/DropboxCallback";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<DropboxOAuth />} /> */}
          {/* <Route path="/dropbox/callback/" element={<DropboxCallback />} /> */}
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
      {/* <DropboxOAuth />
      <DropboxCallback />
       */}
    </>
  );
}

export default App;
