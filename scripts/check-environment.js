import { execSync } from 'child_process';

// Simple function to check exact version matches
function checkExactVersion(current, required, name) {
    if (current !== required) {
        console.error(`❌ ${name} version mismatch:
Required: ${required}
Current:  ${current}`);
        process.exit(1);
    }
    console.log(`✓ ${name} version ${current} matches requirement`);
}

try {
    // Check Node.js version
    const nodeVersion = process.version.replace('v', '');
    checkExactVersion(nodeVersion, '18.19.0', 'Node.js');

    // Check npm version
    const npmVersion = execSync('npm -v').toString().trim();
    checkExactVersion(npmVersion, '10.0.0', 'npm');

    console.log('✨ Environment check passed');
} catch (error) {
    console.error('Environment check failed:', error.message);
    process.exit(1);
}