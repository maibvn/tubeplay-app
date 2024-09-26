require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/connectDB");
const initializeDropbox = require("./utils/refreshAccessToken");
const authRouter = require("./routes/auth");
const playlistRouter = require("./routes/playlist");
// const userRouter = require("./routes/user");
const { authenticateToken } = require("./middleware/authenticateToken");

// DATABASE
connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*", // Adjust according to your needs (e.g., specify allowed origins)
  })
);
// DROPBOX
// Middleware to get the dbx client
const dbxMiddleware = async (req, res, next) => {
  try {
    req.dbx = await initializeDropbox();
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

app.use(dbxMiddleware);

// app.use(authenticateToken);

// ROUTES
app.use("/api/auth", authRouter); // Authentication routes
app.use("/api/playlist", authenticateToken, playlistRouter); // Playlist management

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
