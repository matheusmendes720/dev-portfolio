const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('../produtividade/fin_ops/planning/competitive_programing/local/lowhack');

const requiredDirs = [
    '00_Regulamento',
    '01_Intel_OSINT',
    '02_Estrategia_Vencedora',
    '03_Arquitetura_Projeto',
    '04_BI_Ofensivo',
    '05_Market_Intelligence'
];

async function migrate() {
    console.log(`[+] Target workspace: ${targetDir}`);
    
    if (!fs.existsSync(targetDir)) {
        console.error('[-] Directory not found. Check relative path.');
        process.exit(1);
    }

    console.log('[+] Creating strict 6-node directories...');
    for (const dir of requiredDirs) {
        const fullPath = path.join(targetDir, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`  -> Created ${dir}`);
        }
    }

    console.log('\n[+] Moving data (Editais -> Regulamento)');
    const editaisPath = path.join(targetDir, 'editais');
    if (fs.existsSync(editaisPath)) {
        const files = fs.readdirSync(editaisPath);
        files.forEach(f => {
            const oldPath = path.join(editaisPath, f);
            const newPath = path.join(targetDir, '00_Regulamento', f);
            fs.renameSync(oldPath, newPath);
            console.log(`  -> Moved ${f}`);
        });
        fs.rmdirSync(editaisPath);
    }

    console.log('\n[+] Moving data (Research -> OSINT)');
    const researchPath = path.join(targetDir, 'research');
    if (fs.existsSync(researchPath)) {
        const files = fs.readdirSync(researchPath);
        files.forEach(f => {
            const oldPath = path.join(researchPath, f);
            const newPath = path.join(targetDir, '01_Intel_OSINT', f);
            fs.renameSync(oldPath, newPath);
            console.log(`  -> Moved ${f}`);
        });
        fs.rmdirSync(researchPath);
    }

    // Move specific note
    const notePath = path.join(targetDir, 'note-index.md');
    if (fs.existsSync(notePath)) {
        // Rename appropriately and set the node pattern
        const newNotePath = path.join(targetDir, '02_Estrategia_Vencedora', '00_INDEX.md');
        fs.renameSync(notePath, newNotePath);
        console.log('\n[+] Migrated note-index.md to 02_Estrategia_Vencedora/00_INDEX.md');
    }

    console.log('\n[+] Low Hack directory successfully standardized to the 6-Node Architecture.');
}

migrate().catch(console.error);
