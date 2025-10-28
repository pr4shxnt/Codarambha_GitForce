const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not defined. Please check your .env file.");
    }
    
    await mongoose.connect(process.env.MONGO_URL);
    
    console.log("MongoDB connected successfully");
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    
    const dbName = mongoose.connection.name;
    console.log(`Connected to database: ${dbName}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.log("Please check if your MongoDB connection string is correct and the database is accessible.");
    process.exit(1);
  }
};

module.exports = connectDB;
