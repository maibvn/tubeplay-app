import React from "react";
import AudioPlayerList from "./page/AudioPlayerList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./page/Login";
import SignUp from "./page/SignUp";

import Home from "./Home";
function App() {
  // set state of login
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setIsLogin(userInfo.isLogin);
      setUser(userInfo.user);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/login"
          element={
            <Login
              setIsLogin={(value) => setIsLogin(value)}
              setUser={(value) => setUser(value)}
            />
          }
        />
        {/* {!isLoading && plUrl && <AudioPlayerList />} */}
        <Route path="/playlist" element={<AudioPlayerList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
