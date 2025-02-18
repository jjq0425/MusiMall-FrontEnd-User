import fs from 'fs';
const timestamp = new Date().toLocaleString();
const str = `export const buildTimestamp = '${timestamp}';`;
fs.writeFileSync('./src/buildTimestamp.js', str);