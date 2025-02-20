import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    console.log('Testing imports...');
    const nodeVersion = process.version;
    const npmOutput = execSync('npm -v').toString().trim();
    
    console.log('Node version:', nodeVersion);
    console.log('npm version:', npmOutput);
    console.log('Directory:', __dirname);
    
    console.log('All imports working correctly');
} catch (error) {
    console.error('Import test failed:', error.message);
    process.exit(1);
}