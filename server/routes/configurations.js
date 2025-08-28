import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all configurations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = 'SELECT * FROM configurations WHERE is_active = true';
    const queryParams = [];
    
    if (type) {
      query += ' AND config_type = $1';
      queryParams.push(type);
    }
    
    query += ' ORDER BY display_order ASC, config_name ASC';

    const { rows } = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Get configurations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create configuration
router.post('/', authenticateToken, requireRole(['admin']), [
  body('config_type').isLength({ min: 1 }).trim(),
  body('config_name').isLength({ min: 1 }).trim(),
  body('config_value').isLength({ min: 1 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { config_type, config_name, config_value, display_order = 0, is_active = true } = req.body;

    const { rows } = await pool.query(`
      INSERT INTO configurations (config_type, config_name, config_value, display_order, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [config_type, config_name, config_value, display_order, is_active]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create configuration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update configuration
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updates)];

    const { rows } = await pool.query(`
      UPDATE configurations 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update configuration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete configuration
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM configurations WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Delete configuration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;