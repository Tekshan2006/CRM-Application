// ========================================
// NOTES ROUTES - FULLY COMMENTED FOR STUDENTS
// ========================================
// This file handles Note operations (Add, Read, Delete)
// Notes are attached to leads and can store important information

// ===== IMPORTS =====
const express = require('express');
const pool = require('../config/database');              // Database connection
const authMiddleware = require('../middleware/authMiddleware'); // Check if user logged in
const { body, validationResult } = require('express-validator'); // Validate inputs

const router = express.Router();

// =========================================
// ROUTE 1: ADD NOTE TO LEAD
// POST /api/notes
// =========================================
// Create a new note attached to a lead
router.post(
  '/',
  authMiddleware,
  // VALIDATION
  [
    body('leadId').isInt(),  // leadId must be a valid integer
    body('content').notEmpty().withMessage('Note content is required'),  // Content can't be empty
  ],
  async (req, res) => {
    // STEP 1: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // STEP 2: Extract data from request body
      const { leadId, content } = req.body;

      // STEP 3: Get database connection
      const connection = await pool.getConnection();

      // STEP 4: Check if lead exists (can't add note to non-existent lead)
      const [leads] = await connection.execute('SELECT * FROM leads WHERE id = ?', [leadId]);

      if (leads.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Lead not found' });
      }

      // STEP 5: Insert note into database
      const [result] = await connection.execute(
        'INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)',
        [
          leadId,          // Which lead this note belongs to
          content,         // The note content
          req.user.id      // Who created this note (from JWT token)
        ]
      );

      connection.release();

      // STEP 6: Send success response with new note ID
      res.status(201).json({
        id: result.insertId,  // Auto-generated note ID
        message: 'Note added successfully',
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add note' });
    }
  }
);

// =========================================
// ROUTE 2: GET NOTES FOR A LEAD
// GET /api/notes/lead/:leadId
// =========================================
// Fetch all notes attached to a specific lead
router.get('/lead/:leadId', authMiddleware, async (req, res) => {
  try {
    // STEP 1: Get lead ID from URL
    // Example: /api/notes/lead/5 means leadId = 5
    const { leadId } = req.params;

    // STEP 2: Get database connection
    const connection = await pool.getConnection();

    // STEP 3: Fetch all notes for this lead
    // Also join with users table to get creator name
    const [notes] = await connection.execute(
      'SELECT n.*, u.name as creator_name FROM notes n LEFT JOIN users u ON n.created_by = u.id WHERE n.lead_id = ? ORDER BY n.created_at DESC',
      [leadId]
    );

    connection.release();

    // STEP 4: Send notes to frontend
    res.json(notes);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// =========================================
// ROUTE 3: DELETE NOTE
// DELETE /api/notes/:id
// =========================================
// Delete a note (only creator can delete their own notes)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // STEP 1: Get note ID from URL
    const { id } = req.params;

    // STEP 2: Get database connection
    const connection = await pool.getConnection();

    // STEP 3: Fetch the note
    const [notes] = await connection.execute('SELECT * FROM notes WHERE id = ?', [id]);

    // STEP 4: Check if note exists
    if (notes.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Note not found' });
    }

    // STEP 5: Check authorization
    // Only the person who created the note can delete it
    if (notes[0].created_by !== req.user.id) {
      connection.release();
      return res.status(403).json({ error: 'Not authorized to delete this note' });
    }

    // STEP 6: Delete the note
    await connection.execute('DELETE FROM notes WHERE id = ?', [id]);

    connection.release();

    // STEP 7: Send success response
    res.json({ message: 'Note deleted successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// ========== EXPORT ROUTES ==========
// Other files import this to use these routes
module.exports = router;
