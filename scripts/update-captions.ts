import { parse } from 'csv-parse/sync';
import fs from 'fs';
import { db } from '../server/db';
import { portfolioImages } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateCaptions() {
  try {
    // Read the CSV file
    const csvContent = fs.readFileSync('./attached_assets/Embeded Links (1)_1753620747607.csv', 'utf-8');
    
    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    }) as Array<{ filename: string; imageurl: string; caption: string; }>;

    console.log(`Found ${records.length} records in CSV`);

    // Update captions for each record
    for (const record of records) {
      if (record.caption && record.caption.trim() !== '') {
        const result = await db
          .update(portfolioImages)
          .set({ caption: record.caption })
          .where(eq(portfolioImages.filename, record.filename));
        
        console.log(`Updated caption for ${record.filename}`);
      }
    }

    console.log('Caption update completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating captions:', error);
    process.exit(1);
  }
}

updateCaptions();