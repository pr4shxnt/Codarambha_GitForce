const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Role = require("../models/role.model");

// Temporary route to list users
exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id email username');
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
      nationalId,
      nationalIdNumber,
    } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });
    
    // Get the default rider role
    const riderRole = await Role.findOne({ name: 'rider' });
    if (!riderRole) {
      console.error('Default rider role not found');
      return res.status(500).json({ message: "Error creating user - role not found" });
    }

    const newUser = new User({
      username,
      email,
      password, // Let the pre-save hook handle hashing
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
      nationalId,
      nationalIdNumber,
      roles: [riderRole._id] // Assign the default rider role
    });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );
    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      console.log('Invalid input types:', { email: typeof email, password: typeof password });
      return res.status(400).json({ message: "Credentials Tampered" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('User found:', { 
      email: user.email, 
      hasPassword: !!user.password
    });

    try {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error('Password comparison error:', error);
      return res.status(500).json({ message: "Error verifying credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: "30d" }
    );
    
    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create initial admin user
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, adminSecret } = req.body;

    // Verify admin creation secret
    if (adminSecret !== process.env.ADMIN_CREATION_SECRET) {
      return res.status(403).json({ message: "Invalid admin creation secret" });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin email already registered" });
    }

    // Get admin role
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      return res.status(500).json({ message: "Admin role not found. Please initialize RBAC first." });
    }

    // Create admin user
    const hashed = await bcrypt.hash(password, 10);
    const adminUser = new User({
      email,
      password: hashed,
      firstName: "System",
      lastName: "Admin",
      phoneNumber: req.body.phoneNumber || "0000000000",
      address: req.body.address || "System Address",
      nationalId: "Citizenship",
      nationalIdNumber: req.body.nationalIdNumber || "ADMIN-" + Date.now(),
      dateOfBirth: req.body.dateOfBirth || new Date("1990-01-01"),
      roles: [adminRole._id],
      isVerified: true
    });

    await adminUser.save();

    const token = jwt.sign(
      { id: adminUser._id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: adminUser._id,
        email: adminUser.email,
        roles: ['admin']
      },
      token
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ message: "Admin creation failed", error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
