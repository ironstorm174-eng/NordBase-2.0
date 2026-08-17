const fs = require('fs');
let content = fs.readFileSync('src/utils/upload.ts', 'utf-8');
const sizeCheck = `  const base64Data = await convertToBase64(file);
  
  // Calculate approximate payload size (base64 size + overhead)
  const payloadSize = base64Data.length + 1024;
  if (payloadSize > 900 * 1024) { // 900KB limit for the 1MB Nginx proxy limit
    throw new Error('File is too large for this preview environment. Please use an image or smaller file (under 750KB).');
  }
`;
content = content.replace("  const base64Data = await convertToBase64(file);", sizeCheck);
fs.writeFileSync('src/utils/upload.ts', content);
