import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import pool from '../config/database.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload single file
router.post('/single', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save file info to database
    const { rows } = await pool.query(`
      INSERT INTO file_uploads (filename, original_name, mime_type, file_size, file_path, uploaded_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      req.file.path,
      req.user.id
    ]);

    // Return file URL
    const fileUrl = `/api/uploads/files/${req.file.filename}`;
    
    res.json({
      id: rows[0].id,
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_url: fileUrl,
      file_size: req.file.size,
      mime_type: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload multiple files
router.post('/multiple', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      // Save file info to database
      const { rows } = await pool.query(`
        INSERT INTO file_uploads (filename, original_name, mime_type, file_size, file_path, uploaded_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        file.filename,
        file.originalname,
        file.mimetype,
        file.size,
        file.path,
        req.user.id
      ]);

      uploadedFiles.push({
        id: rows[0].id,
        filename: file.filename,
        original_name: file.originalname,
        file_url: `/api/uploads/files/${file.filename}`,
        file_size: file.size,
        mime_type: file.mimetype
      });
    }

    res.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Serve uploaded files
router.get('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

// Delete file
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM file_uploads WHERE id = $1 AND uploaded_by = $2',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'File not found or access denied' });
    }

    const file = rows[0];

    // Delete file from filesystem
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // Delete from database
    await pool.query('DELETE FROM file_uploads WHERE id = $1', [req.params.id]);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;