// require("dotenv").config(); // To load environment variables
// const axios = require("axios"); // Ensure axios is imported

// async function getAccessToken(authorizationCode, redirect_uri) {
//   const tokenUrl = "https://api.dropboxapi.com/oauth2/token";

//   const params = new URLSearchParams();
//   params.append("code", authorizationCode);
//   params.append("grant_type", "authorization_code");
//   params.append("redirect_uri", redirect_uri);

//   try {
//     const response = await axios.post(tokenUrl, params, {
//       auth: {
//         username: process.env.DROPBOX_CLIENT_ID, // Dropbox App Key
//         password: process.env.DROPBOX_CLIENT_SECRET, // Dropbox App Secret
//       },
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     // Now fetch the user's email
//     const { access_token, refresh_token, uid } = response.data;

//     return { access_token, refresh_token, uid };
//   } catch (error) {
//     console.error("Error fetching access token:", error.response.data);
//   }
// }
// module.exports = getAccessToken;
