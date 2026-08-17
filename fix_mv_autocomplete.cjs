const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceView.tsx', 'utf-8');

if (!content.includes('AddressAutocomplete')) {
  content = content.replace(
    "import { store } from '../store';",
    "import { store } from '../store';\nimport { AddressAutocomplete } from './AddressAutocomplete';"
  );
}

// update the filter logic
content = content.replace(
  "      // Filter by city\n      if (selectedCity && s.city !== selectedCity) {\n        return false;\n      }",
  "      // Filter by city (locationSearch)\n      if (selectedCity) {\n        const loc = selectedCity.toLowerCase();\n        const sCity = (s.city || '').toLowerCase();\n        if (!loc.includes(sCity) && !sCity.includes(loc)) {\n          return false;\n        }\n      }"
);

// update the render part
const oldSelect = `<div className="sm:w-64 relative">
          <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 text-white appearance-none focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer"
          >
            <option value="">Any Location</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>`;

const newSelect = `<div className="sm:w-80 relative flex-shrink-0 z-50">
          <AddressAutocomplete
            value={selectedCity}
            onChange={(val) => setSelectedCity(val)}
            placeholder="Any Location"
            className="[&>input]:bg-slate-800 [&>input]:border-none [&>input]:py-3 [&>input]:pl-12"
          />
        </div>`;

content = content.replace(oldSelect, newSelect);

fs.writeFileSync('src/components/MarketplaceView.tsx', content);
