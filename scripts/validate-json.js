#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function validateJSON(filePath) {
    try {
        // Read the file content
        const content = readFileSync(filePath, 'utf8');
        
        // First, try to parse the JSON to check basic syntax
        JSON.parse(content);
        
        // Now check for common issues that might cause problems
        const validationResults = [
            {
                check: content.includes('//'),
                message: 'Comments are not allowed in JSON files'
            },
            {
                check: content.includes(',...'),
                message: 'Spread operator is not valid JSON syntax'
            },
            {
                check: /,\s*[}\]]/.test(content),
                message: 'Trailing commas are not allowed in JSON'
            }
        ];

        // Check for any validation failures
        const failures = validationResults.filter(result => result.check);
        
        if (failures.length > 0) {
            throw new Error(failures.map(f => f.message).join('\n'));
        }

        console.log('\x1b[32m%s\x1b[0m', '✓ JSON validation passed');
        return true;

    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'JSON Validation Error:');
        console.error('\x1b[31m%s\x1b[0m', `File: ${filePath}`);
        console.error('\x1b[31m%s\x1b[0m', `Error: ${error.message}`);
        
        // Try to identify the problematic line
        if (error instanceof SyntaxError) {
            const lines = content.split('\n');
            const errorMatch = error.message.match(/position\s+(\d+)/);
            
            if (errorMatch) {
                const pos = parseInt(errorMatch[1]);
                let lineNo = 0;
                let currentPos = 0;
                
                // Find the line number where the error occurred
                while (currentPos < pos && lineNo < lines.length) {
                    currentPos += lines[lineNo].length + 1;
                    lineNo++;
                }
                
                console.error('\x1b[33m%s\x1b[0m', `Problem detected around line ${lineNo}`);
                console.error('Context:');
                
                // Show the problematic line and its surroundings
                for (let i = Math.max(0, lineNo - 2); i < Math.min(lines.length, lineNo + 3); i++) {
                    if (i === lineNo - 1) {
                        console.error('\x1b[31m→ ' + lines[i] + '\x1b[0m');
                    } else {
                        console.error('  ' + lines[i]);
                    }
                }
            }
        }
        
        return false;
    }
}

// Main execution
const filePath = process.argv[2];
if (!filePath) {
    console.error('\x1b[31m%s\x1b[0m', 'Please provide a file path to validate');
    process.exit(1);
}

try {
    const absolutePath = resolve(process.cwd(), filePath);
    const isValid = validateJSON(absolutePath);
    
    if (!isValid) {
        process.exit(1);
    }
} catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Execution error:', error.message);
    process.exit(1);
}