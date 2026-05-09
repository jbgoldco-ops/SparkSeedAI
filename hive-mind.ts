import fs from 'fs/promises';
import path from 'path';
import { quantumBus } from './lib/quantum-bus.ts';

async function scanProject(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const res = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== '.git') {
                await scanProject(res);
            }
        } else {
            console.log(`[BUILDER] Context indexed: ${entry.name}`);
        }
    }
}

async function initializeHive() {
    console.log("--- Awakening the Spark Seed Hive ---");
    await scanProject(process.cwd());
    
    // Signal the Crew is ready
    await quantumBus.writeToBlockchain('Signal', 'Full project context loaded. Awaiting instructions.');
}

initializeHive();
