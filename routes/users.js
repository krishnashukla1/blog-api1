const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => { // Registration route
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    user = new User({ name, email, password: hashedPassword }); // Create a new user
    await user.save();

    res.status(201).json({
      status: 201,
      success: true,
      message: 'User registered successfully',
      user: { id: user._id, name, email },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
});

router.post('/login', async (req, res) => { // Login route
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare password with hashed password
    if (!isMatch) {                                                // If password does not match
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid credentials',
      });
    }

    const payload = { id: user._id, name: user.name };              // Create payload for JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Sign the token with secret key

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }, // Return user data
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
});

module.exports = router;