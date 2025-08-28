import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later' }
});

// Login endpoint
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const { rows } = await pool.query(
      'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Return user data (without password)
    const { password_hash, ...userWithoutPassword } = user;
    res.json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint (admin only)
router.post('/register', authenticateToken, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('full_name').isLength({ min: 2 }),
  body('role').isIn(['admin', 'manager', 'user'])
], async (req, res) => {
  try {
    // Only admins can create new users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create new users' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, full_name, role, department, territory } = req.body;

    // Check if user already exists
    const { rows: existingUsers } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const { rows } = await pool.query(`
      INSERT INTO users (email, password_hash, full_name, role, department, territory)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, full_name, role, department, territory, created_at
    `, [email, passwordHash, full_name, role, department, territory]);

    res.status(201).json({ user: rows[0] });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, full_name, role, department, territory, phone, avatar_url, last_login, created_at FROM users WHERE id = $1',
      [req.user.id]
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

// Update current user
router.put('/me', authenticateToken, [
  body('full_name').optional().isLength({ min: 2 }),
  body('department').optional().isLength({ min: 1 }),
  body('territory').optional().isLength({ min: 1 }),
  body('phone').optional().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { full_name, department, territory, phone } = req.body;

    const { rows } = await pool.query(`
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          department = COALESCE($2, department),
          territory = COALESCE($3, territory),
          phone = COALESCE($4, phone),
          updated_at = NOW()
      WHERE id = $5
      RETURNING id, email, full_name, role, department, territory, phone, avatar_url, last_login, created_at
    `, [full_name, department, territory, phone, req.user.id]);

    res.json(rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;