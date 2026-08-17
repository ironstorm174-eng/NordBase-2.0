const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistDashboard.tsx', 'utf-8');

content = content.replace(
  "type: file.type || 'image/jpeg',",
  "type: 'image/jpeg',"
);
content = content.replace(
  "file.type || 'image/jpeg',",
  "'image/jpeg',"
);
content = content.replace(
  "const fileToUpload = processedFile instanceof File ? processedFile : new File([processedFile], file.name, { type: file.type || 'image/jpeg' });",
  "const fileToUpload = processedFile instanceof File ? processedFile : new File([processedFile], file.name, { type: 'image/jpeg' });"
);

fs.writeFileSync('src/components/SpecialistDashboard.tsx', content);
