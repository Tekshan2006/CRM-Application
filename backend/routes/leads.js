// ========================================
// LEADS ROUTES - FULLY COMMENTED FOR STUDENTS
// ========================================
// This file handles all Lead CRUD operations (Create, Read, Update, Delete)
// Also handles dashboard statistics calculations

// ===== IMPORTS =====
const express = require('express');
const pool = require('../config/database');              // Database connection
const authMiddleware = require('../middleware/authMiddleware'); // Check if user logged in
const { body, validationResult } = require('express-validator'); // Validate inputs

const router = express.Router();

// =========================================
// ROUTE 1: GET ALL LEADS (with filtering)
// GET /api/leads
// =========================================
// This endpoint gets all leads with optional filters and search
router.get('/', authMiddleware, async (req, res) => {
  try {
    // STEP 1: Get filter parameters from URL
    // Example: /api/leads?status=New&search=John
    const { status, leadSource, assignedSalesperson, search } = req.query;

    // STEP 2: Build dynamic SQL query
    // Start with basic SELECT that joins with users table
    let sqlQuery = 'SELECT l.*, u.name as salesperson_name FROM leads l LEFT JOIN users u ON l.assigned_salesperson_id = u.id WHERE 1=1';
    const params = [];  // Parameters to prevent SQL injection

    // STEP 3: Add filters conditionally
    // Only add WHERE clauses for filters that were provided
    
    if (status) {
      sqlQuery += ' AND l.status = ?';  // Filter by status (New, Qualified, Won, Lost)
      params.push(status);
    }

    if (leadSource) {
      sqlQuery += ' AND l.lead_source = ?';  // Filter by source (Website, Email, Phone, etc)
      params.push(leadSource);
    }

    if (assignedSalesperson) {
      sqlQuery += ' AND l.assigned_salesperson_id = ?';  // Filter by assigned salesperson
      params.push(assignedSalesperson);
    }

    if (search) {
      // Search in name OR company_name OR email (case-insensitive)
      sqlQuery += ' AND (l.name LIKE ? OR l.company_name LIKE ? OR l.email LIKE ?)';
      const searchTerm = '%' + search + '%';  // % = wildcard for partial matching
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // STEP 4: Order by creation date (newest first)
    sqlQuery += ' ORDER BY l.created_at DESC';

    // STEP 5: Execute query and send results
    const connection = await pool.getConnection();
    const [leads] = await connection.execute(sqlQuery, params);
    connection.release();

    res.json(leads);  // Send leads to frontend
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// =========================================
// ROUTE 2: GET SINGLE LEAD WITH NOTES
// GET /api/leads/:id
// =========================================
// Get one lead by ID and all notes attached to it
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    // STEP 1: Get lead ID from URL
    // Example: /api/leads/5 means id = 5
    const { id } = req.params;

    // STEP 2: Get database connection
    const connection = await pool.getConnection();

    // STEP 3: Fetch lead data
    const [leads] = await connection.execute(
      'SELECT l.*, u.name as salesperson_name FROM leads l LEFT JOIN users u ON l.assigned_salesperson_id = u.id WHERE l.id = ?',
      [id]
    );

    // STEP 4: Check if lead exists
    if (leads.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Lead not found' });
    }

    // STEP 5: Fetch all notes for this lead
    const [notes] = await connection.execute(
      'SELECT n.*, u.name as creator_name FROM notes n LEFT JOIN users u ON n.created_by = u.id WHERE n.lead_id = ? ORDER BY n.created_at DESC',
      [id]
    );

    connection.release();

    // STEP 6: Send lead and notes to frontend
    res.json({
      ...leads[0],     // Spread lead data (copy all properties)
      notes,           // Add notes array to response
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// =========================================
// ROUTE 3: CREATE NEW LEAD
// POST /api/leads
// =========================================
// Create a new lead in the database
router.post(
  '/',
  authMiddleware,
  // VALIDATION - These checks run BEFORE the route handler
  [
    body('name').notEmpty().withMessage('Lead name is required'),
    body('companyName').optional(),
    body('email').optional().isEmail(),        // If provided, must be valid email
    body('phoneNumber').optional(),
    body('leadSource').notEmpty().withMessage('Lead source is required'),
    body('dealValue').optional().isFloat({ min: 0 }), // Must be 0 or higher
  ],
  async (req, res) => {
    // STEP 1: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // STEP 2: Extract data from request body
      const {
        name,
        companyName,
        email,
        phoneNumber,
        leadSource,
        assignedSalespersonId,
        status = 'New',        // Default status is 'New'
        dealValue = 0,         // Default deal value is 0
      } = req.body;

      // STEP 3: Get database connection
      const connection = await pool.getConnection();

      // STEP 4: Insert lead into database
      const [result] = await connection.execute(
        'INSERT INTO leads (name, company_name, email, phone_number, lead_source, assigned_salesperson_id, status, deal_value, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          name, 
          companyName, 
          email, 
          phoneNumber, 
          leadSource, 
          assignedSalespersonId || null,  // null if no salesperson assigned
          status, 
          dealValue, 
          req.user.id  // Who created this lead (from JWT token)
        ]
      );

      connection.release();

      // STEP 5: Send success response with new lead ID
      res.status(201).json({
        id: result.insertId,  // insertId = auto-generated database ID
        message: 'Lead created successfully',
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create lead' });
    }
  }
);

// =========================================
// ROUTE 4: UPDATE LEAD
// PUT /api/leads/:id
// =========================================
// Update an existing lead (only update fields that are provided)
router.put(
  '/:id',
  authMiddleware,
  // VALIDATION
  [
    body('name').optional().notEmpty(),
    body('companyName').optional(),
    body('email').optional().isEmail(),
    body('phoneNumber').optional(),
    body('leadSource').optional(),
    body('status').optional(),
    body('dealValue').optional().isFloat({ min: 0 }),
  ],
  async (req, res) => {
    // STEP 1: Check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // STEP 2: Get lead ID and data to update
      const { id } = req.params;
      const {
        name,
        companyName,
        email,
        phoneNumber,
        leadSource,
        assignedSalespersonId,
        status,
        dealValue,
      } = req.body;

      // STEP 3: Get database connection
      const connection = await pool.getConnection();

      // STEP 4: Check if lead exists
      const [leads] = await connection.execute('SELECT * FROM leads WHERE id = ?', [id]);

      if (leads.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Lead not found' });
      }

      // STEP 5: Build dynamic UPDATE statement
      // Only include fields that were actually provided (not undefined)
      // This prevents overwriting fields with undefined values
      const updateData = {};
      
      if (name) updateData.name = name;
      if (companyName !== undefined) updateData.company_name = companyName;
      if (email) updateData.email = email;
      if (phoneNumber) updateData.phone_number = phoneNumber;
      if (leadSource) updateData.lead_source = leadSource;
      if (assignedSalespersonId !== undefined) updateData.assigned_salesperson_id = assignedSalespersonId;
      if (status) updateData.status = status;
      if (dealValue !== undefined) updateData.deal_value = dealValue;

      // Convert updateData into SQL SET clause
      // { name: 'John', status: 'Won' } becomes "name = ?, status = ?"
      const updateFields = Object.keys(updateData)
        .map((key) => key + ' = ?')
        .join(', ');
      const updateValues = Object.values(updateData);

      // STEP 6: Execute UPDATE query
      await connection.execute(
        'UPDATE leads SET ' + updateFields + ', updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        updateValues.concat([id])
      );

      connection.release();

      // STEP 7: Send success response
      res.json({ message: 'Lead updated successfully' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update lead' });
    }
  }
);

// =========================================
// ROUTE 5: DELETE LEAD
// DELETE /api/leads/:id
// =========================================
// Delete a lead (also deletes all associated notes due to CASCADE DELETE)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // STEP 1: Get lead ID from URL
    const { id } = req.params;

    // STEP 2: Get database connection
    const connection = await pool.getConnection();

    // STEP 3: Check if lead exists
    const [leads] = await connection.execute('SELECT * FROM leads WHERE id = ?', [id]);

    if (leads.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Lead not found' });
    }

    // STEP 4: Delete the lead
    // All notes will be deleted automatically (CASCADE DELETE in database)
    await connection.execute('DELETE FROM leads WHERE id = ?', [id]);

    connection.release();

    // STEP 5: Send success response
    res.json({ message: 'Lead deleted successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// =========================================
// ROUTE 6: GET DASHBOARD STATISTICS
// GET /api/leads/dashboard/stats
// =========================================
// Get all statistics for the dashboard
// This single SQL query calculates all 7 dashboard metrics
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    // STEP 1: Get database connection
    const connection = await pool.getConnection();

    // STEP 2: Execute complex SQL query to calculate all stats at once
    // Using CASE WHEN to count leads by status
    // Using SUM to calculate total and won deal values
    const statsQuery = 'SELECT ' +
      'COUNT(*) as total_leads, ' +
      'SUM(CASE WHEN status = "New" THEN 1 ELSE 0 END) as new_leads, ' +
      'SUM(CASE WHEN status = "Qualified" THEN 1 ELSE 0 END) as qualified_leads, ' +
      'SUM(CASE WHEN status = "Won" THEN 1 ELSE 0 END) as won_leads, ' +
      'SUM(CASE WHEN status = "Lost" THEN 1 ELSE 0 END) as lost_leads, ' +
      'SUM(deal_value) as total_deal_value, ' +
      'SUM(CASE WHEN status = "Won" THEN deal_value ELSE 0 END) as won_deal_value ' +
      'FROM leads';
    
    const [stats] = await connection.execute(statsQuery);

    connection.release();

    // STEP 3: Send statistics to frontend
    res.json(stats[0]);  // stats[0] because execute returns array with results array
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ========== EXPORT ROUTES ==========
// Other files import this to use these routes
module.exports = router;
