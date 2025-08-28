import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Add type parser for PostGIS GEOMETRY columns
// This prevents serialization errors when fetching records with geometry data
pg.types.setTypeParser(pg.types.builtins.GEOMETRY, (value) => {
  if (!value) return null;
  
  try {
    // Parse simple POINT geometries into {x, y} objects
    const pointMatch = value.match(/POINT\(([^)]+)\)/);
    if (pointMatch) {
      const coords = pointMatch[1].split(' ');
      return {
        x: parseFloat(coords[0]),
        y: parseFloat(coords[1])
      };
    }
    
    // For other geometry types, return null to avoid serialization issues
    return null;
  } catch (error) {
    console.warn('Failed to parse geometry:', error);
    return null;
  }
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export default pool;