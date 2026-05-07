// ========================================
// AUTHENTICATION ROUTES
// ========================================
// This file handles Login and Register endpoints
// Users can create accounts and log in here

// ===== IMPORTS =====
const express = require('express');          // Web framework
const bcrypt = require('bcryptjs');          // Hash passwords securely
const jwt = require('jsonwebtoken');         // Create login tokens
const pool = require('../config/database');  // Database connection
const { body, validationResult } = require('express-validator'); // Validate form inputs

// Create router for these routes
const router = express.Router();

// =========================================
// ROUTE 1: REGISTER NEW USER
// POST /api/auth/register
// =========================================
router.post(
  '/register',
  // ===== VALIDATION =====
  // These checks run BEFORE the route handler
  [
    body('email').isEmail(),                    // Check email is valid format
    body('password').isLength({ min: 6 }),     // Check password is at least 6 characters
    body('name').notEmpty(),                   // Check name is not empty
  ],
  async (req, res) => {
    // ===== STEP 1: Check validation results =====
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Validation failed - send error to frontend
      return res.status(400).json({ errors: errors.array() });
    }

    // ===== STEP 2: Get form data from request =====
    const { name, email, password } = req.body;

    try {
      // ===== STEP 3: Get database connection =====
      const connection = await pool.getConnection();
      
      // ===== STEP 4: Check if user already exists =====
      const [existingUser] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]  // ? = placeholder, email goes here (prevents SQL injection)
      );

      // If user exists, return error
      if (existingUser.length > 0) {
        connection.release();  // Close database connection
        return res.status(400).json({ error: 'User already exists' });
      }

      // ===== STEP 5: Hash the password securely =====
      // bcrypt uses 10 "salt rounds" (higher number = more secure but slower)
      // We NEVER store the actual password, only the hashed version
      const hashedPassword = await bcrypt.hash(password, 10);

      // ===== STEP 6: Create user in database =====
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'salesperson']  // New users are salespersons
      );

      // ===== STEP 7: Close connection and send success =====
      connection.release();  // Return connection to pool
      res.status(201).json({ message: 'User registered successfully' });
      
    } catch (error) {
      // Something went wrong
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// =========================================
// ROUTE 2: LOGIN USER
// POST /api/auth/login
// =========================================
router.post(
  '/login',
  // ===== VALIDATION =====
  [
    body('email').isEmail(),       // Check email is valid format
    body('password').notEmpty(),   // Check password is provided
  ],
  async (req, res) => {
    // ===== STEP 1: Check validation =====
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ===== STEP 2: Get form data =====
    const { email, password } = req.body;

    try {
      // ===== STEP 3: Get database connection =====
      const connection = await pool.getConnection();

      // ===== STEP 4: Find user by email =====
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      connection.release();

      // ===== STEP 5: Check if user exists =====
      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // ===== STEP 6: Get user data =====
      const user = users[0];
      
      // ===== STEP 7: Compare passwords =====
      // bcrypt.compare() checks if entered password matches hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      // ===== STEP 8: If password doesn't match =====
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // ===== STEP 9: Create JWT token =====
      // Token is like a digital ID card that proves user is logged in
      // Token includes: user id, email, role, and name
      // Token expires in 7 days
      const token = jwt.sign(
        { 
          id: user.id,        // User's database ID
          email: user.email,  // User's email
          role: user.role,    // User's role (salesperson or admin)
          name: user.name     // User's name
        },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }  // Token expires in 7 days
      );

      // ===== STEP 10: Send token and user info to frontend =====
      res.json({
        token,  // Token for future requests
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
      
    } catch (error) {
      // Something went wrong
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// ========== EXPORT ROUTES ==========
module.exports = router;
