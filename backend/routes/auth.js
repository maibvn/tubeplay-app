const express = require("express");
const {
  signupUser,
  loginUser,
  authenticateToken,
} = require("../controllers/auth");
const router = express.Router();

// Register a new user
router.post("/signup", signupUser);

// Login user
router.post("/login", loginUser);

// authenticateToken
router.get("/verify-token", authenticateToken);

module.exports = router;
