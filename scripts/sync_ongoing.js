import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_ROOT = path.resolve('C:/Users/mathe/code_space/produtividade/fin_ops/planning/competitive_programing/local');
const CSV_PATH = path.join(__dirname, '../datasets/dataset_c_ongoing-contests.csv');

/**
 * Scan local/ directory for ongoing contest metadata and sync to CSV.
 * This is the 'Intelligence Bridge' between Qualitative research and Quantitative UI.
 */
async function sync() {
    console.log('--- SYNCING ONGOING CONTESTS (6-Node Architecture) ---\n');

    if (!fs.existsSync(CSV_PATH)) {
        console.error('[-] Error: dataset_c_ongoing-contests.csv not found.');
        process.exit(1);
    }

    const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
    // Simple CSV parser for this specific file
    const entries = lines.slice(1).filter(l => l.trim()).map(line => {
        const values = line.split(',');
        const entry = {};
        headers.forEach((h, i) => entry[h] = values[i]);
        return entry;
    });

    console.log(`[+] Found ${entries.length} tracked missions in Dataset C.\n`);

    for (const entry of entries) {
        const fullLocalPath = path.join(LOCAL_ROOT, entry.local_path.replace('local/', ''));
        console.log(`[CHECKING] ${entry.event_id} at ${fullLocalPath}...`);

        if (fs.existsSync(fullLocalPath)) {
            // 1. Extract dynamic metadata from local files
            // For now, we prioritize note-index.md if it exists
            const noteIndex = path.join(fullLocalPath, 'note-index.md');
            const officialIndex = path.join(fullLocalPath, '02_Estrategia_Vencedora', '00_INDEX.md');
            
            let source = null;
            if (fs.existsSync(noteIndex)) source = noteIndex;
            else if (fs.existsSync(officialIndex)) source = officialIndex;

            if (source) {
                console.log(`  -> Found index at ${path.basename(source)}`);
                const content = fs.readFileSync(source, 'utf8');
                
                // Extract Dates from markdown if present (Regex simple match for YYYY-MM-DD range)
                const dateMatches = content.match(/(\d{4}-\d{2}-\d{2})\s?→\s?(\d{4}-\d{2}-\d{2})/);
                if (dateMatches) {
                    entry.date_start = dateMatches[1];
                    entry.date_end = dateMatches[2];
                    console.log(`  -> Updated dates: ${entry.date_start} to ${entry.date_end}`);
                }

                // Extract Status
                if (content.includes('status: in_progress') || content.includes('Status Atual: **PRONTO PARA COMBATE**')) {
                    entry.status = 'ongoing';
                }
            } else {
                console.log(`  -> Warning: No index found. Relying on manual CSV entries.`);
            }
        } else {
            console.log(`  -> Warning: Local directory not found.`);
        }
    }

    // Write back to CSV
    const newContent = [
        headers.join(','),
        ...entries.map(e => headers.map(h => e[h]).join(','))
    ].join('\n');

    fs.writeFileSync(CSV_PATH, newContent);
    console.log(`\n[SUCCESS] Synchronized Dataset C with local intelligence nodes.`);
}

sync().catch(console.error);
