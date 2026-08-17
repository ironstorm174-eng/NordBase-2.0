const fs = require('fs');

const pt = fs.readFileSync('src/components/AcademyPT.tsx', 'utf8');
const match = pt.match(/>([^<{}]+)</g);
console.log('Matches:', match.length);
