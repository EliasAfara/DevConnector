const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// production
const path = require("path");

const app = express();

const corsOption = {
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOption));

// Connect Database
connectDB();

// Init Middleware (Allow us to get the data from frontend)
app.use(express.json({ extended: false }));

// app.get('/', (req, res) => res.send('API RUNNING'));

// Define Routes
app.use("/api/users", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
