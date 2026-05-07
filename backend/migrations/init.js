// ========================================
// DATABASE INITIALIZATION - FULLY COMMENTED FOR STUDENTS
// ========================================
// This file creates the database schema and tables
// It runs once to set up the entire database structure

// ===== IMPORTS =====
const mysql = require('mysql2/promise');  // MySQL connection library
require('dotenv').config();  // Load environment variables

// =========================================
// MAIN FUNCTION: Initialize Database
// =========================================
const initializeDatabase = async () => {
  // STEP 1: Connect to MySQL (without specifying a database yet)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD,
  });

  try {
    // STEP 2: Create database if it doesn't exist
    await connection.execute(
      'CREATE DATABASE IF NOT EXISTS ' + (process.env.DB_NAME || 'crm_db')
    );

    // STEP 3: Switch to the new database
    await connection.changeUser({ database: process.env.DB_NAME || 'crm_db' });

    // ========== CREATE USERS TABLE ==========
    // Stores user account information
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'salesperson',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    // Columns explained:
    // - id: Unique identifier (auto-generates)
    // - name: User's full name
    // - email: Email address (UNIQUE = no duplicate emails)
    // - password: Hashed password (never store plain text!)
    // - role: User type (admin or salesperson)
    // - created_at: When user account was created
    // - updated_at: Last time account was modified

    // ========== CREATE LEADS TABLE ==========
    // Stores sales lead information
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        email VARCHAR(255),
        phone_number VARCHAR(20),
        lead_source VARCHAR(100),
        assigned_salesperson_id INT,
        status VARCHAR(50) DEFAULT 'New',
        deal_value DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        FOREIGN KEY (assigned_salesperson_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    // Columns explained:
    // - id: Unique lead identifier
    // - name: Lead contact person name
    // - company_name: Company name
    // - email: Contact email
    // - phone_number: Contact phone
    // - lead_source: How we got this lead (Website, Email, etc)
    // - assigned_salesperson_id: Which salesperson handles this lead (FOREIGN KEY)
    // - status: Current status (New, Qualified, Won, Lost)
    // - deal_value: Potential deal amount
    // - created_by: Which user created this lead (FOREIGN KEY)
    // FOREIGN KEY = connects to another table (users)
    // ON DELETE SET NULL = if salesperson is deleted, set to NULL

    // ========== CREATE NOTES TABLE ==========
    // Stores notes attached to leads
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_id INT NOT NULL,
        content TEXT NOT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    // Columns explained:
    // - id: Unique note identifier
    // - lead_id: Which lead this note belongs to (FOREIGN KEY)
    // - content: The note text (TEXT = longer text than VARCHAR)
    // - created_by: Which user wrote this note (FOREIGN KEY)
    // - created_at: When note was created
    // ON DELETE CASCADE = if lead is deleted, delete all its notes too

    // STEP 4: Check if admin user already exists
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE email = 'admin@example.com'"
    );

    // STEP 5: If admin doesn't exist, create one
    if (users.length === 0) {
      const bcrypt = require('bcryptjs');  // Password hashing library
      
      // Hash the password securely
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Insert admin user into database
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [
          'Admin User',
          'admin@example.com',
          hashedPassword,
          'admin'  // This user has admin role
        ]
      );
      console.log('✓ Admin user created (admin@example.com / password123)');
    }

    // STEP 6: Success message
    console.log('✓ Database initialized successfully');
    
    // STEP 7: Close connection
    await connection.end();
    
  } catch (error) {
    // If anything goes wrong, show error and exit
    console.error('Error initializing database:', error);
    await connection.end();
    process.exit(1);  // Exit with error code
  }
};

// ========== RUN INITIALIZATION ==========
// Call the function when this file is run
initializeDatabase();
