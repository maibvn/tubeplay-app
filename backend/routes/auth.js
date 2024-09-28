const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const {
  signupUser,
  loginUser,
  authenticateToken,
} = require("../controllers/auth");
const passport = require("passport");

const router = express.Router();

// Register a new user
router.post("/signup", signupUser);

// Login user
router.post("/login", loginUser);

const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload; // Contains user info (email, name, etc.)
};

// Auth with Google
router.post("/google", async (req, res) => {
  const { token } = req.body;
  // console.log(token);

  try {
    // Verify the Google ID token
    const userData = await verifyGoogleToken(token);
    // Process the user data (create user session, save to database, etc.)
    req.session.user = {
      name: userData.name,
      email: userData.email,
    };
    // Respond to the frontend with user info or a session token
    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error("Error verifying Google ID token:", err);
    res.status(401).json({ message: "Invalid Google ID token" });
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
  });
});

// Route to check if user is logged in
router.get("/session", (req, res) => {
  console.log("session", req.session);
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// // Callback route for Google to redirect to
// router.get("/google/callback", () => {
//   console.log("google/callback");
//   passport.authenticate("google", {
//     failureRedirect: "/login", // Handle failure
//     successRedirect: "/dashboard", // Handle success
//   });
// });

// router.get("/login", (re, res) => {
//   console.log("login NOT success");
// });
// router.get("/dashboard", (req, res) => {
//   console.log("login success", req.user);
// });

// authenticateToken
// router.get("/verify-token", authenticateToken);

module.exports = router;
