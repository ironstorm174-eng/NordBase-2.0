const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `onClick={() => {
                            setActiveTab('inbox');
                            setActiveChat({`,
  `onClick={() => {
                            setActiveChat({`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
