const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

try {
    // Try reading as UTF-16LE (common for Windows PowerShell output)
    let content = fs.readFileSync(envPath, 'utf16le');

    // Check if it looks correct (contains "NEXT_PUBLIC")
    if (content.includes('NEXT_PUBLIC')) {
        console.log('Detected UTF-16LE content. Converting to UTF-8...');
    } else {
        // Fallback: maybe it's just UTF-8 with BOM?
        const buffer = fs.readFileSync(envPath);
        if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
            content = buffer.slice(2).toString('utf16le');
            console.log('Detected BOM (FF FE). Decoded as UTF-16LE.');
        } else {
            console.log('Could not auto-detect simple UTF-16LE. Content might be scrambled:');
            console.log(content.substring(0, 50));
            process.exit(1);
        }
    }

    // Write back as UTF-8
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('Successfully re-saved .env as UTF-8.');

} catch (e) {
    console.error('Error fixing .env:', e);
}
