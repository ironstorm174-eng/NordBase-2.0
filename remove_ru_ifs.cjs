const fs = require('fs');

function removeIfRu(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // It's probably returning an array of objects. Let's just remove the block.
  // Easiest is to manually replace if we know the structure or just use sed/awk.
  // Actually, I can just find the block and remove it with regex or parse it out.
  // We can just rely on the fallback.
  // Or just write a small script:
  
  // Find `if (lang === 'ru') {` and the matching `}`. 
  // It's simpler to just do this with text processing in JS.
  
  let lines = content.split('\n');
  let newLines = [];
  let skip = 0;
  for (let line of lines) {
    if (line.includes("if (lang === 'ru') {")) {
      skip = 1; // start skipping
      continue;
    }
    if (skip > 0) {
      if (line.includes("{")) skip++;
      if (line.includes("}")) skip--;
      continue;
    }
    newLines.push(line);
  }
  fs.writeFileSync(filePath, newLines.join('\n'));
}

removeIfRu('src/components/academy/OperatorContent.tsx');
removeIfRu('src/components/academy/SpecialistContent.tsx');
