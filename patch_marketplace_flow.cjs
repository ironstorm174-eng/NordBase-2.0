const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  /<MarketplaceView \n          category=\{selectedCategory\} \n          specialty=\{selectedSpecialty\} \n          onGoBack=\{\(\) => setSelectedSpecialty\(null\)\} \n          currentUser=\{currentUser \|\| null\}/,
  `<MarketplaceView 
          category={selectedCategory} 
          specialty={selectedSpecialty} 
          onGoBack={() => setSelectedSpecialty(null)} 
          currentUser={currentUser || null}
          onRequestLogin={onRequestLogin}`
);

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
