import React, { useEffect } from "react";

const DropboxOAuth = () => {
  const CLIENT_ID = process.env.REACT_APP_DROPBOX_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000/dropbox/callback"; // Your React app's redirect URI

  const handleConnectToDropbox = () => {
    const dropboxAuthUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&token_access_type=offline`;

    // Redirect the user to Dropbox's OAuth 2.0 Authorization page
    window.location.href = dropboxAuthUrl;
  };

  return (
    <div>
      <h1>Connect to Dropbox</h1>
      <button onClick={handleConnectToDropbox}>Connect to Dropbox</button>
    </div>
  );
};

export default DropboxOAuth;
