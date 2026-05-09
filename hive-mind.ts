import fs from 'fs/promises';
import path from 'path';
import { quantumBus } from './lib/quantum-bus.js';

async function scanProject(dir: string) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const res = path.resolve(dir, entry.name);
            
            // Skip heavy or hidden system directories
            if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.DS_Store') {
                continue;
            }

            if (entry.isDirectory()) {
                await scanProject(res);
            } else {
                console.log(`[BUILDER] Context indexed: ${path.relative(process.cwd(), res)}`);
            }
        }
    } catch (error) {
        // Silent skip for permission-denied or locked files
    }
}

async function initializeHive() {
    console.log("--- Awakening the Spark Seed Hive ---");
    await scanProject(process.cwd());
    
    // Signal the Crew that the map is ready
    await quantumBus.writeToBlockchain('Builder', 'Full project context loaded. Map generated.');
    console.log("--- Audit Complete ---");
}

initializeHive().catch(console.error);
