import { readFileSync } from 'fs';
import { db } from '../server/db.js';
import { sql } from 'drizzle-orm';

async function populateDatabase() {
  try {
    console.log('Reading SQL file...');
    const sqlContent = readFileSync('./attached_assets/updated_portfolio_links_1753626634047.sql', 'utf8');
    
    console.log('Executing SQL...');
    await db.execute(sql.raw(sqlContent));
    
    console.log('Database populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateDatabase();