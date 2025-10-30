const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    }],
    permissions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission'
    }],
    active: {
      type: Boolean,
      default: true
    },
    lastLogin: Date,
    loginAttempts: {
      count: { type: Number, default: 0 },
      lastAttempt: Date,
      lockedUntil: Date
    },
    password: {
      type: String,
      required: true,
    },
    profileAvatar: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    linkedWard: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
      },
    ],
    nationalId: {
      type: String,
      required: true,
      enum: ["Citizenship", "NID", "Passport", "Driving License"],
    },
    nationalIdNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    signature: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model("User", userSchema);
