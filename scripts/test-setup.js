import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testScript(scriptPath) {
    try {
        const absolutePath = resolve(__dirname, scriptPath);
        const script = await fs.readFile(absolutePath, 'utf8');
        
        // Check for ES Module syntax
        if (script.includes('require(') || script.includes('module.exports')) {
            throw new Error(`CommonJS syntax found in ${scriptPath}. Use ES Module syntax instead.`);
        }

        return true;
    } catch (error) {
        console.error(`Error testing ${scriptPath}:`, error.message);
        return false;
    }
}

// Test all scripts
const scripts = [
    './check-versions.js',
    './validate-json.js',
    './enhanced-setup.sh'
];

for (const script of scripts) {
    await testScript(script);
}
