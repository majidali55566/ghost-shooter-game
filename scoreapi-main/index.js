const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

const app = express();
const allowedOrigins = ["http://127.0.0.1:5500/"];

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

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/scores", require("./routes/scores"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Dynamic route to serve game.html
app.get("/:rollno/game.html", (req, res) => {
  const rollNo = req.params.rollno;
  // Here, you can add any logic if you need to validate the rollNo or perform other actions
  res.sendFile(path.join(__dirname, "public", "game.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
