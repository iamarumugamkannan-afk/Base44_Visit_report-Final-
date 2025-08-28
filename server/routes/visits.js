import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Calculate visit score
const calculateScore = (visitData) => {
  let score = 0;
  
  // Product visibility (30% weight)
  score += (visitData.product_visibility_score || 0) * 0.3;
  
  // Training provided (20 points)
  if (visitData.training_provided) score += 20;
  
  // Commercial outcome (variable points)
  const commercialScores = {
    new_order: 25,
    order_commitment: 20,
    price_negotiation: 15,
    complaint_resolved: 10,
    information_only: 5,
    no_outcome: 0
  };
  score += commercialScores[visitData.commercial_outcome] || 0;
  
  // Overall satisfaction (25% weight)
  score += (visitData.overall_satisfaction || 0) * 2.5;
  
  return Math.min(100, Math.max(0, score));
};

const getPriorityLevel = (score) => {
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  return 'high';
};

// Get all visits for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 100, offset = 0, order = '-created_at' } = req.query;
    
    // Parse order parameter
    const orderDirection = order.startsWith('-') ? 'DESC' : 'ASC';
    const orderField = order.replace(/^-/, '');
    
    let query = `
      SELECT v.*, c.shop_name as customer_shop_name
      FROM shop_visits v
      LEFT JOIN customers c ON v.customer_id = c.id
    `;
    
    const queryParams = [];
    
    // Non-admin users can only see their own visits
    if (req.user.role !== 'admin') {
      query += ' WHERE v.user_id = $1';
      queryParams.push(req.user.id);
    }
    
    query += ` ORDER BY v.${orderField} ${orderDirection} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const { rows } = await pool.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Get visits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get visit by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT * FROM shop_visits WHERE id = $1';
    const queryParams = [req.params.id];
    
    // Non-admin users can only see their own visits
    if (req.user.role !== 'admin') {
      query += ' AND user_id = $2';
      queryParams.push(req.user.id);
    }

    const { rows } = await pool.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get visit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new visit
router.post('/', authenticateToken, [
  body('customer_id').isUUID(),
  body('shop_name').isLength({ min: 1 }).trim(),
  body('visit_date').isISO8601(),
  body('visit_purpose').isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const visitData = {
      ...req.body,
      user_id: req.user.id
    };

    // Calculate score and priority
    visitData.calculated_score = calculateScore(visitData);
    visitData.priority_level = getPriorityLevel(visitData.calculated_score);

    // Build insert query dynamically
    const fields = Object.keys(visitData);
    const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
    const values = Object.values(visitData);

    const { rows } = await pool.query(`
      INSERT INTO shop_visits (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `, values);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Create visit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update visit
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };
    
    // Recalculate score and priority
    updates.calculated_score = calculateScore(updates);
    updates.priority_level = getPriorityLevel(updates.calculated_score);

    // Build dynamic update query
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    let query = `
      UPDATE shop_visits 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
    `;
    
    const queryParams = [id, ...Object.values(updates)];
    
    // Non-admin users can only update their own visits
    if (req.user.role !== 'admin') {
      query += ' AND user_id = $' + (queryParams.length + 1);
      queryParams.push(req.user.id);
    }
    
    query += ' RETURNING *';

    const { rows } = await pool.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Visit not found or access denied' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Update visit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete visit
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    let query = 'DELETE FROM shop_visits WHERE id = $1';
    const queryParams = [req.params.id];
    
    // Non-admin users can only delete their own visits
    if (req.user.role !== 'admin') {
      query += ' AND user_id = $2';
      queryParams.push(req.user.id);
    }
    
    query += ' RETURNING id';

    const { rows } = await pool.query(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Visit not found or access denied' });
    }

    res.json({ message: 'Visit deleted successfully' });
  } catch (error) {
    console.error('Delete visit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;