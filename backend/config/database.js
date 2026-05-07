// ========================================
// DATABASE CONFIGURATION
// ========================================
// This file sets up the connection to MySQL database
// We use a "connection pool" to manage multiple database connections efficiently

// Import MySQL library for Node.js
const mysql = require('mysql2/promise');

// Load environment variables from .env file
require('dotenv').config();

// ========== CREATE CONNECTION POOL ==========
// A pool manages multiple connections so we don't create new ones each time
const pool = mysql.createPool({
  // Database location (localhost = this computer)
  host: process.env.DB_HOST || 'localhost',
  
  // Database user (usually 'root' for local development)
  user: process.env.DB_USER || 'root',
  
  // Database password (if empty, use empty string)
  // This checks if password is undefined, if so use '', otherwise use the password
  password: process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD,
  
  // Database name (the database to use)
  database: process.env.DB_NAME || 'crm_db',
  
  // Connection pool settings
  waitForConnections: true,      // Wait if no connection available
  connectionLimit: 10,           // Max 10 connections at once
  queueLimit: 0,                // Unlimited queue
  enableKeepAlive: true,         // Keep connections alive
  keepAliveInitialDelayMs: 0,   // Start keep-alive immediately
});

// ========== EXPORT POOL ==========
// Other files import this pool to make database queries
module.exports = pool;
