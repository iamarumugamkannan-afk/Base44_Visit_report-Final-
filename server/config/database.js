import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Setup PostGIS geometry type parser after pool creation
async function setupGeometryParser() {
  try {
    const client = await pool.connect();
    
    // Get the OID for the geometry type
    const result = await client.query("SELECT oid FROM pg_type WHERE typname = 'geometry'");
    
    if (result.rows.length > 0) {
      const geometryOid = result.rows[0].oid;
      
      // Register type parser for PostGIS GEOMETRY columns
      pg.types.setTypeParser(geometryOid, (value) => {
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
      
      console.log('✅ PostGIS geometry type parser registered');
    }
    
    client.release();
  } catch (error) {
    console.warn('⚠️ Failed to setup geometry parser:', error);
  }
}

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
  // Setup geometry parser on first connection
  setupGeometryParser();
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export default pool;