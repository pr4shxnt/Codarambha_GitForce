const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Role = require("../models/role.model");

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
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashed,
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
      nationalId,
      nationalIdNumber,
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
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
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
