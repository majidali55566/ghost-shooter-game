const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();
const allowedOrigins = ["https://ghost-shooter-game.netlify.app"];

// Function to check if the origin is a local development URL
const isLocalOrigin = (origin) => {
  const localRegex = /^(http:\/\/localhost|http:\/\/127\.0\.0\.1):\d{1,5}$/;
  return localRegex.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isLocalOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This allows cookies to be sent
};

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || isLocalOrigin(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

// Middleware to handle CORS and credentials
app.use(credentials);
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON:", err.message);
    return res.status(400).send({ error: "Invalid JSON payload" });
  }
  next();
});

const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the connection string from environment variables
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/scores", require("./routes/scores"));

app.get("/", (req, res) => {
  res.json({
    message: "Working Successss",
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
