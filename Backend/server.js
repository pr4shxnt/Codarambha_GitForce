const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./services/mongoose.service");
const { initializeRBAC } = require("./services/rbac.service");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database and RBAC system
async function initializeServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');

    // Initialize RBAC system
    await initializeRBAC();
    console.log('RBAC system initialized successfully');
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
}

// Start initialization
initializeServer();

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

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/wards", require("./routes/ward.routes"));
app.use("/api/card-requests", require("./routes/card.request.routes"));
app.use("/api/wallets", require("./routes/wallet.routes"));
app.use("/api/rbac/roles", require("./routes/role.routes"));
app.use("/api/nfc", require("./routes/nfc.routes"));
app.use("/api/rbac/permissions", require("./routes/permission.routes"));

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
