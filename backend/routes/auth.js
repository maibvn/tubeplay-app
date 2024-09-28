const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const passport = require("passport");
const User = require("../models/user");

const { signupUser, loginUser } = require("../controllers/auth");

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

router.post("/google", async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the Google ID token
    const userData = await verifyGoogleToken(token);

    // Check if user already exists in the database
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      // Create a new user if not found
      user = new User({
        name: userData.name,
        email: userData.email,
        googleId: userData.sub, // 'sub' is the unique Google ID
        // You can store more fields if necessary, e.g. profile picture
      });
      await user.save();
    }

    // Save user data to session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    // Respond to the frontend with user info or a session token
    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error("Error verifying Google ID token:", err);
    res.status(401).json({ message: "Invalid Google ID token" });
  }
});

// Route to check if the user is still logged in (session check)
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "No active session" });
  }
});

// // Auth with Google
// router.post("/google", async (req, res) => {
//   const { token } = req.body;

//   try {
//     // Verify the Google ID token
//     const userData = await verifyGoogleToken(token);
//     // Process the user data (create user session, save to database, etc.)
//     req.session.user = {
//       name: userData.name,
//       email: userData.email,
//     };
//     // Respond to the frontend with user info or a session token
//     res
//       .status(200)
//       .json({ message: "Login successful", user: req.session.user });
//   } catch (err) {
//     console.error("Error verifying Google ID token:", err);
//     res.status(401).json({ message: "Invalid Google ID token" });
//   }

//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   });
// });

// // Route to check if user is logged in
// router.get("/session", (req, res) => {
//   console.log("session", req.session);
//   if (req.session.user) {
//     res.status(200).json({ loggedIn: true, user: req.session.user });
//   } else {
//     res.status(401).json({ loggedIn: false });
//   }
// });

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
