require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/connectDB");
const initializeDropbox = require("./utils/refreshAccessToken");
const authRouter = require("./routes/auth");
const playlistRouter = require("./routes/playlist");
// const userRouter = require("./routes/user");
const { authenticateToken } = require("./middleware/authenticateToken");
const initConfig = require("./config/index"); // Import the configuration
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// DATABASE
connectDB();

const port = process.env.PORT || 5000;
const app = express();

// Set up session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Ensure credentials are included
  })
);

// Initialize Passport
initConfig(app);

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

// ROUTES
app.use("/api/auth", authRouter); // Authentication routes
// app.use("/api/playlist", playlistRouter); // Playlist management
app.use("/api/playlist", authenticateToken, playlistRouter); // Playlist management

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
