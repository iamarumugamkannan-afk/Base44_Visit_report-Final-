import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await pool.query(`
      INSERT INTO users (email, password_hash, full_name, role, department)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@canna.com', adminPassword, 'Admin User', 'admin', 'management']);

    // Create sample sales rep
    const userPassword = await bcrypt.hash('user123', 12);
    await pool.query(`
      INSERT INTO users (email, password_hash, full_name, role, department, territory)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['sales@canna.com', userPassword, 'Sales Representative', 'user', 'sales', 'Netherlands North']);

    // Seed configuration data
    const configurations = [
      // Visit purposes
      { type: 'visit_purposes', name: 'Routine Check', value: 'routine_check', order: 1 },
      { type: 'visit_purposes', name: 'Training Session', value: 'training', order: 2 },
      { type: 'visit_purposes', name: 'Product Promotion', value: 'promotion', order: 3 },
      { type: 'visit_purposes', name: 'Complaint Resolution', value: 'complaint_resolution', order: 4 },
      { type: 'visit_purposes', name: 'New Products Introduction', value: 'new_products', order: 5 },
      { type: 'visit_purposes', name: 'Other', value: 'other', order: 6 },

      // CANNA Products
      { type: 'canna_products', name: 'CANNA Coco', value: 'canna_coco', order: 1 },
      { type: 'canna_products', name: 'CANNA Terra', value: 'canna_terra', order: 2 },
      { type: 'canna_products', name: 'CANNA Aqua', value: 'canna_aqua', order: 3 },
      { type: 'canna_products', name: 'CANNAZYM', value: 'cannazym', order: 4 },
      { type: 'canna_products', name: 'RHIZOTONIC', value: 'rhizotonic', order: 5 },
      { type: 'canna_products', name: 'PK 13/14', value: 'pk_13_14', order: 6 },
      { type: 'canna_products', name: 'BOOST Accelerator', value: 'boost_accelerator', order: 7 },
      { type: 'canna_products', name: 'CANNA Start', value: 'canna_start', order: 8 },

      // Competitor presence levels
      { type: 'competitor_presence', name: 'None - CANNA exclusive', value: 'none', order: 1 },
      { type: 'competitor_presence', name: 'Low - Minimal competition', value: 'low', order: 2 },
      { type: 'competitor_presence', name: 'Medium - Some competitors present', value: 'medium', order: 3 },
      { type: 'competitor_presence', name: 'High - Strong competition', value: 'high', order: 4 }
    ];

    for (const config of configurations) {
      await pool.query(`
        INSERT INTO configurations (config_type, config_name, config_value, display_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [config.type, config.name, config.value, config.order]);
    }

    // Seed sample customers
    const customers = [
      {
        shop_name: 'Green Thumb Garden Center',
        shop_type: 'garden_center',
        shop_address: 'Hoofdstraat 123',
        zipcode: '1000 AB',
        city: 'Amsterdam',
        county: 'Noord-Holland',
        region: 'Netherlands North',
        contact_person: 'Jan de Vries',
        contact_phone: '+31 20 123 4567',
        contact_email: 'jan@greenthumb.nl',
        job_title: 'Store Manager'
      },
      {
        shop_name: 'Hydro Pro Store',
        shop_type: 'hydroponics_store',
        shop_address: 'Industrieweg 45',
        zipcode: '3000 CD',
        city: 'Rotterdam',
        county: 'Zuid-Holland',
        region: 'Netherlands South',
        contact_person: 'Maria Janssen',
        contact_phone: '+31 10 987 6543',
        contact_email: 'maria@hydropro.nl',
        job_title: 'Owner'
      }
    ];

    for (const customer of customers) {
      await pool.query(`
        INSERT INTO customers (shop_name, shop_type, shop_address, zipcode, city, county, region, contact_person, contact_phone, contact_email, job_title)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING
      `, [
        customer.shop_name, customer.shop_type, customer.shop_address,
        customer.zipcode, customer.city, customer.county, customer.region,
        customer.contact_person, customer.contact_phone, customer.contact_email, customer.job_title
      ]);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('📧 Admin login: admin@canna.com / admin123');
    console.log('📧 Sales rep login: sales@canna.com / user123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();