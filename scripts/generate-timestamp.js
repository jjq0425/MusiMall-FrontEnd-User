import fs from 'fs';
const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
const str = `export const buildTimestamp = '${timestamp}';`;
fs.writeFileSync('./src/buildTimestamp.js', str);