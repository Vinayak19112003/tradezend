const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
console.log('Checking .env at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('.env file exists.');
    const result = dotenv.config();
    if (result.error) {
        console.error('Error loading .env:', result.error);
    } else {
        console.log('.env loaded successfully.');
        console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'EXISTS' : 'MISSING');
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');

        // Check for content/format issues
        const content = fs.readFileSync(envPath, 'utf8');
        console.log('File Content Preview (First 10 chars):', content.substring(0, 10) + '...');
    }
} else {
    console.error('.env file NOT found.');
}
