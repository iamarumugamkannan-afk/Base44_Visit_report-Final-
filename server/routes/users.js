import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, email, full_name, role, department, territory, phone, 
             avatar_url, is_active, last_login, created_at
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID (admin only)
router.get('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, full_name, role, department, territory, phone, 
              avatar_url, is_active, last_login, created_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, requireRole(['admin']), [
  body('full_name').optional().isLength({ min: 2 }),
  body('role').optional().isIn(['admin', 'manager', 'user']),
  body('department').optional().isLength({ min: 1 }),
  body('territory').optional().isLength({ min: 1 }),
  body('phone').optional().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updates)];

    const { rows } = await pool.query(`
      UPDATE users 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, full_name, role, department, territory, phone, 
                avatar_url, is_active, last_login, created_at
    `, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user permissions (admin only)
router.put('/:id/permissions', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const { rows } = await pool.query(`
      UPDATE users 
      SET permissions = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, full_name, role, permissions
    `, [id, JSON.stringify(permissions)]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update permissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deactivate user (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE users SET is_active = false WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;