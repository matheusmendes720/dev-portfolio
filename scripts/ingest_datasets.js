import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../datasets');
const FILES = [
    'dataset_a_competitive_programming.csv',
    'dataset_b_hackathons_innovation.csv',
    'dataset_c_ongoing-contests.csv'
];

async function ingest() {
    console.log('--- RAW DATA INGESTION & TRANSFORMATION ---\n');
    let allEvents = [];

    for (const file of FILES) {
        const filePath = path.join(DATA_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.error(`[MISSING] ${file}`);
            continue;
        }

        console.log(`[PROCESSING] ${file}...`);
        const rows = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => rows.push(row))
                .on('end', resolve)
                .on('error', reject);
        });

        // Transform Rows
        const transformed = rows.map(row => {
            const tags = [];
            if (row.category) tags.push(row.category.toLowerCase().replace(' ', '-'));
            if (row.tech_stack_required) {
                row.tech_stack_required.split('/').forEach(t => tags.push(t.trim().toLowerCase()));
            }

            let organizer = "Unknown";
            if (file.includes('Hackathon') && row.event_name) {
                organizer = row.event_name.split(' ')[0];
            } else if (row.event_name) {
                organizer = row.event_name.split(' ')[0];
            }

            // Fix Link Logic with column shift detection
            let link = "#";
            if (row.platform_url && row.platform_url.startsWith('http')) {
                link = row.platform_url;
            } else if (row.ai_policy && row.ai_policy.startsWith('http')) {
                // Fallback for shifted columns in dataset_a
                link = row.ai_policy;
            } else if (row.source_file && row.source_file.startsWith('http')) {
                link = row.source_file;
            }

            const description = row.notes || row.eligibility_detail || "No description available.";

            // --- ADVANCED METRICS ENGINEERING ---

            // 1. Financials Normalization
            // Parse "Free", "$20", "20 USD", "R$ 100" -> Numeric USD
            let numericCost = 0;
            if (row.entry_cost_usd && row.entry_cost_usd !== '0') {
                numericCost = parseFloat(row.entry_cost_usd);
            }
            if (!numericCost && row.entry_cost_brl && row.entry_cost_brl !== '0') {
                // Rough conversion BRL -> USD (approx 1/6 for safety/simplicity or just 0.18)
                numericCost = parseFloat(row.entry_cost_brl) * 0.18;
            }

            // Prize Pool
            let prizePool = parseFloat(row.prize_pool_usd) || 0;

            // 2. ROI Score Calculation (0-100)
            // Logarithmic scale to balance massive prizes against low costs
            // Formula: (Log(Prize + 1) * 20) / (Log(Cost + 1) + 1)
            // If Free (Cost=0), Denominator=1. Max ROI.
            const logPrize = Math.log10(prizePool + 1);
            const logCost = Math.log10(numericCost + 1);
            let roiScore = (logPrize * 25) / (logCost + 1);

            // Cap at 100, Min at 0
            if (roiScore > 100) roiScore = 100;
            if (roiScore < 0) roiScore = 0;
            // Boost "Free" events with ANY prize
            if (numericCost === 0 && prizePool > 0) roiScore += 10;
            if (roiScore > 100) roiScore = 100;


            // 3. Urgency Index (Time Sensitivity)
            const eventDate = new Date(row.date_start);
            const today = new Date();
            const msPerDay = 1000 * 60 * 60 * 24;
            const daysToStart = Math.ceil((eventDate - today) / msPerDay);

            let urgencyScore = 0;
            if (daysToStart < 0) urgencyScore = 0; // Already started
            else if (daysToStart <= 7) urgencyScore = 100; // Critical
            else if (daysToStart <= 30) urgencyScore = 75; // High
            else if (daysToStart <= 90) urgencyScore = 50; // Medium
            else urgencyScore = 25; // Low

            return {
                id: row.event_id,
                title: row.event_name,
                tier: row.tier, // S, A, B, C
                type: row.location_city ? 'Presencial' : 'Online',
                date: row.date_start,
                endDate: row.date_end,


                // Metrics
                prizePool: prizePool,
                cost: parseFloat(row.entry_cost_usd) > 0 ? `$${row.entry_cost_usd}` : 'Free',
                numericCost: numericCost,
                roiScore: Math.round(roiScore),
                urgencyScore: urgencyScore,
                daysToStart: daysToStart,
                location: row.location_city ? `${row.location_city}, ${row.location_country}` : 'Online',
                coordinates: null,
                organizer: organizer,
                description: description,
                tags: [...new Set(tags)], // Unique tags
                status: new Date(row.date_start) > new Date() ? 'upcoming' : 'active',
                link: link
            };
        });

        allEvents = [...allEvents, ...transformed];
        console.log(`  > Ingested ${transformed.length} events from ${file}`);
    }

    // Deduplicate and Prioritize (Last one wins, so dataset_c overrides a/b)
    const eventMap = new Map();
    allEvents.forEach(evt => eventMap.set(evt.id, evt));
    const dedupedEvents = Array.from(eventMap.values());

    // Write to src/data/contestData.js
    const outputPath = path.join(__dirname, '../src/data/contestData.js');

    const fileContent = `
// AUTO-GENERATED BY scripts/ingest_datasets.js
// DO NOT EDIT MANUALLY - UPDATE CSVs INSTEAD

export const EVENTS = ${JSON.stringify(dedupedEvents, null, 4)};

export const CATEGORY_COLORS = {
    'institutional': '#7f8fa6',
    'culture': '#e056fd',
    'workshop': '#f0932b',
    'hackathon': '#ff5f56',
    'conference': '#22a6b3',
    'innovation': '#badc58',
    'scientific': '#686de0',
    'startup': '#f9ca24',
    'competition': '#30336b',
    'sports': '#eb4d4b',
    'registration': '#535c68',
    'algorithmic': '#3b82f6',
    'ctf': '#ef4444',
    'web3': '#8b5cf6',
    'ai_agents': '#10b981'
};

export const TIER_COLORS = {
    'S': '#8b5cf6', // Neon Purple
    'A': '#10b981', // Neon Green
    'B': '#3b82f6', // Neon Blue
    'C': '#718096'  // Slate
};

export const TYPE_COLORS = {
    'Presencial': '#27c93f',
    'Online': '#00d2ff'
};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`\n[SUCCESS] Wrote ${allEvents.length} events to src/data/contestData.js`);
}

ingest().catch(console.error);
