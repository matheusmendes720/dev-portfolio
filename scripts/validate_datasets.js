import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../datasets');
const FILES = [
    'dataset_a_competitive_programming.csv',
    'dataset_b_hackathons_innovation.csv'
];

async function validate() {
    console.log('--- STARTING DATASET VALIDATION ---\n');

    for (const file of FILES) {
        const filePath = path.join(DATA_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.error(`[MISSING] ${file}`);
            continue;
        }

        console.log(`[ANALYZING] ${file}...`);
        const rows = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => rows.push(row))
                .on('end', resolve)
                .on('error', reject);
        });

        console.log(`  > Found ${rows.length} rows.`);

        // Validation Checks
        let missingDates = 0;
        let missingUrls = 0;

        rows.forEach((row, index) => {
            // Check Dates
            if (!row.date_start) {
                missingDates++;
            } else if (new Date(row.date_start).toString() === 'Invalid Date') {
                console.warn(`  ! Row ${index + 2}: Invalid date_start "${row.date_start}"`);
            }

            // Check URLs
            if (!row.platform_url || row.platform_url.trim() === '') {
                missingUrls++;
            }
        });

        if (missingDates > 0) console.warn(`  ! ${missingDates} rows have MISSING start dates.`);
        if (missingUrls > 0) console.warn(`  ! ${missingUrls} rows have MISSING URLs.`);

        console.log(`  > Validation complete.\n`);
    }
}

validate().catch(console.error);
