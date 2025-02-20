import { execSync } from 'child_process';

function checkVersion(current, required, type) {
    if (current !== required) {
        console.error('\x1b[31m%s\x1b[0m', `Error: ${type} version mismatch`);
        console.error('\x1b[31m%s\x1b[0m', `Required: ${required}`);
        console.error('\x1b[31m%s\x1b[0m', `Current:  ${current}`);
        process.exit(1);
    }
    return true;
}

try {
    // Check Node.js version
    const nodeVersion = process.version.replace('v', '');
    const requiredNode = '18.19.0';
    checkVersion(nodeVersion, requiredNode, 'Node.js');

    // Check npm version
    const npmVersion = execSync('npm -v').toString().trim();
    const requiredNpm = '10.0.0';
    checkVersion(npmVersion, requiredNpm, 'npm');

    console.log('\x1b[32m%s\x1b[0m', '✓ Node.js and npm versions match requirements');
} catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Version check failed:', error.message);
    process.exit(1);
}