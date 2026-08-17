const fs = require('fs');

let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

if (!code.includes("getCategoryServiceSchema")) {
  code = code.replace(
    "import { Helmet } from 'react-helmet-async';",
    "import { Helmet } from 'react-helmet-async';\nimport { getCategoryServiceSchema, getBreadcrumbSchema } from '../lib/seoSchemas';"
  );
}

// Add Helmet inside renderBrowserFrame or homepage
const helmetInject = `<Helmet>
          {selectedCategory ? (
            <>
              <title>{selectedCategory} Services in Portugal | NordBase.pt</title>
              <meta name="description" content={\`Urgent \${selectedCategory} services and repairs in Portugal. Verified local technicians dispatched fast in Lisboa, Porto, and Algarve.\`} />
              <script type="application/ld+json">{JSON.stringify(getCategoryServiceSchema(selectedCategory))}</script>
              <script type="application/ld+json">{JSON.stringify(getBreadcrumbSchema([
                { name: 'Home', url: 'https://nordbase.pt/' },
                { name: selectedCategory, url: \`https://nordbase.pt/services/\${selectedCategory}\` }
              ]))}</script>
            </>
          ) : (
            <>
              <title>NordBase.pt - Urgent Local Services & Dispatch in Portugal</title>
              <meta name="description" content="Quick dispatch and coordination of urgent local services in Portugal. Connect with electricians, plumbers, locks emergency, and technicians." />
            </>
          )}
        </Helmet>`;

if (!code.includes("NordBase.pt - Urgent Local Services & Dispatch in Portugal")) {
  code = code.replace(
    '<section className="w-full" id="customer-seo-container">',
    `<section className="w-full" id="customer-seo-container">\n        ${helmetInject}`
  );
}

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
console.log('CustomerFlow updated with dynamic Helmet & JSON-LD!');
