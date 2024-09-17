const axios = require("axios");

// Replace with your Dropbox app credentials
const CLIENT_ID = process.env.DROPBOX_ID;
const CLIENT_SECRET = process.env.DROPBOX_SECRET;

// const redirectUri = "http://localhost:5000"; // Your local redirect URI

// const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
//   redirectUri
// )}`;

// Your refresh token from the OAuth process
const REFRESH_TOKEN = "your_refresh_token";

// Dropbox OAuth token endpoint
const TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";

// Function to refresh the access token
async function refreshDropboxToken() {
  try {
    const response = await axios.post(TOKEN_URL, null, {
      params: {
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Extract the new access token from the response
    const newAccessToken = response.data.access_token;
    console.log("New Access Token:", newAccessToken);

    // Store or use the new access token as needed
    return newAccessToken;
  } catch (error) {
    console.error(
      "Error refreshing token:",
      error.response ? error.response.data : error.message
    );
  }
}

// Example: Call the function to refresh the token
refreshDropboxToken();
