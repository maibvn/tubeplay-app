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

  const token = JSON.parse(localStorage.getItem("tubeplay-token"));

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const fetchUser = async () => {
      if (token) {
        axios
          .get(`${process.env.REACT_APP_API_DOMAIN}/api/playlist`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const userEmail = res.data.email;
            setUser({ email: userEmail });
            setIsLogin(true);
          })
          .catch((err) => {
            console.error("Error verifying token:", err);
          });
      }
    };
    if (userInfo) {
      setIsLogin(userInfo.isLogin);
      setUser(userInfo.user);
    } else {
      fetchUser();
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
