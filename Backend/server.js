const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./services/mongoose.service");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "👋 Hi, this is Prashant! You're at the root of my API. This powers the website https://transitpay.prashantadhikari7.com.np.",
    github: "https://www.github.com/pr4shxnt",
    instagram: "https://www.instagram.com/pr4xnt",
    twitter: "https://www.x.com/pr4xnt",
    linkedin: "https://www.linkedin.com/in/prashantadhikariii",
    youtube: "https://www.youtube.com/@lynxplays6702",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
