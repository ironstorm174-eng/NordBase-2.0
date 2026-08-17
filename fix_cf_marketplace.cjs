const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf-8');

content = content.replace(
  "  const isMarketplaceCategory = selectedCategory && ['Care', 'Lessons', 'Other'].includes(selectedCategory);",
  "  const isMarketplaceCategory = selectedCategory && selectedSpecialty && ['Care', 'Lessons', 'Other'].includes(selectedCategory);"
);

content = content.replace(
  "          category={selectedCategory} \n          onGoBack={() => onSelectCategory(null)} ",
  "          category={selectedCategory} \n          specialty={selectedSpecialty} \n          onGoBack={() => setSelectedSpecialty(null)} "
);

fs.writeFileSync('src/components/CustomerFlow.tsx', content);
