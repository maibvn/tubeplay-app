import React from "react";
import AudioPlayerList from "./page/AudioPlayerList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./page/Login";
import SignUp from "./page/SignUp";

import Home from "./page/Home";
import NavBar from "./page/NavBar";
function App() {
  // set state of login
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  // const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setIsLogin(userInfo.isLogin);
      setUser(userInfo.user);
    }
  }, []);

  const token = JSON.parse(localStorage.getItem("tubeplay-token"));

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_DOMAIN}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data.userEmail;
          console.log(user);

          // window.location.href = res.status === 200 ? "/" : "/login";
        })
        .catch((err) => {
          localStorage.removeItem("tubeplay-token");
          console.error("Error verifying token:", err);
        });
    } else {
      // window.location.href = "/login";
    }
  }, []);

  return (
    <BrowserRouter>
      <NavBar
        isLogin={isLogin}
        setIsLogin={(value) => setIsLogin(value)}
        user={user}
        setUser={(value) => setUser(value)}
      />
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
        <Route path="/playlist" element={<AudioPlayerList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
