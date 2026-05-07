// ========================================
// CRM BACKEND SERVER - Main Entry Point
// ========================================
// This file sets up the Express server and connects all routes

// Load environment variables from .env file (like PORT, DATABASE credentials)
require('dotenv').config();

// Import the frameworks and libraries we need
const express = require('express');  // Web server framework
const cors = require('cors');        // Allow requests from frontend
const authRoutes = require('./routes/auth');      // Login/Register routes
const leadsRoutes = require('./routes/leads');    // Lead CRUD routes
const notesRoutes = require('./routes/notes');    // Note CRUD routes

// Create Express application
const app = express();

// Get PORT from environment or use 5000 as default
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARE (Process all incoming requests) ==========
// CORS: Allow frontend (localhost:3001) to make requests to this backend
app.use(cors());

// JSON Parser: Convert incoming request bodies from JSON to JavaScript objects
// This lets us work with JSON data easily in our route handlers
app.use(express.json());

// ========== ROUTES (Define API endpoints) ==========
// When frontend makes requests to /api/auth, send to auth routes (login, register)
app.use('/api/auth', authRoutes);

// When frontend makes requests to /api/leads, send to leads routes (CRUD operations)
app.use('/api/leads', leadsRoutes);

// When frontend makes requests to /api/notes, send to notes routes (Note CRUD)
app.use('/api/notes', notesRoutes);

// ========== HEALTH CHECK ==========
// Simple endpoint to test if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });  // Return OK status as JSON
});

// ========== ERROR HANDLING ==========
// Catch any errors that happen in route handlers and send error response
app.use((err, req, res, next) => {
  console.error(err);  // Log error to console for debugging
  res.status(500).json({ error: 'Internal server error' });  // Send error to frontend
});

// ========== 404 HANDLER ==========
// If request doesn't match any route, send 404 Not Found error
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ========== START SERVER ==========
// Listen on PORT and print message when server starts
app.listen(PORT, () => {
  console.log(`✓ CRM Backend Server running on http://localhost:${PORT}`);
});
