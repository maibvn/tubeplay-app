import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DropboxCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    if (authorizationCode) {
      // Send the authorization code to the backend to exchange it for tokens

      axios
        .post("http://localhost:5000/auth/dropbox/token", {
          code: authorizationCode,
          redirect_uri: "http://localhost:3000/dropbox/callback",
        })
        .then((response) => {
          navigate("/home"); // Redirect to home or another page after successful authentication
        })
        .catch((error) => {
          console.error("Error exchanging authorization code:", error);
        });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Handling Dropbox OAuth Callback...</h1>
    </div>
  );
};

export default DropboxCallback;
