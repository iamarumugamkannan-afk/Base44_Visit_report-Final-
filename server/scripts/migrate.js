import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Get list of migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get already executed migrations
    const { rows: executedMigrations } = await pool.query(
      'SELECT filename FROM migrations ORDER BY id'
    );
    const executedFilenames = executedMigrations.map(row => row.filename);

    // Execute pending migrations
    for (const filename of migrationFiles) {
      if (!executedFilenames.includes(filename)) {
        console.log(`📄 Executing migration: ${filename}`);
        
        const migrationPath = path.join(migrationsDir, filename);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        await pool.query('BEGIN');
        try {
          await pool.query(migrationSQL);
          await pool.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
          await pool.query('COMMIT');
          console.log(`✅ Migration ${filename} completed successfully`);
        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        }
      } else {
        console.log(`⏭️  Migration ${filename} already executed`);
      }
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();