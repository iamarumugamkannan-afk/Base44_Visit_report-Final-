import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all customers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM customers 
      WHERE status = 'active'
      ORDER BY shop_name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new customer
router.post('/', authenticateToken, requireRole(['admin', 'manager']), [
  body('shop_name').isLength({ min: 1 }).trim(),
  body('shop_type').isIn(['growshop', 'garden_center', 'nursery', 'hydroponics_store', 'other']),
  body('contact_email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      shop_name, shop_type, shop_address, zipcode, city, county, region,
      contact_person, contact_phone, contact_email, job_title
    } = req.body;

    const { rows } = await pool.query(`
      INSERT INTO customers (
        shop_name, shop_type, shop_address, zipcode, city, county, region,
        contact_person, contact_phone, contact_email, job_title
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      shop_name, shop_type, shop_address, zipcode, city, county, region,
      contact_person, contact_phone, contact_email, job_title
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
router.put('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updates)];

    const { rows } = await pool.query(`
      UPDATE customers 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete customer
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;