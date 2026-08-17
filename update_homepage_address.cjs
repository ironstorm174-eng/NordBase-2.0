const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

const targetStr = `          <div className="w-full max-w-sm mx-auto mb-6 h-[46px] relative">
            {gridStep === 'city' ? (`;

const newStr = `          <div className="w-full max-w-xl mx-auto mb-6 relative z-50">
            {gridStep === 'region' && (
              <div className="mb-8 w-full">
                <AddressAutocomplete
                  value={specificLocation}
                  onChange={setSpecificLocation}
                  placeholder="Enter exact address (e.g. Rua Augusta, Lisboa)"
                />
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-px bg-blue-900/40 flex-1"></div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">OR SELECT MANUALLY</span>
                  <div className="h-px bg-blue-900/40 flex-1"></div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full max-w-sm mx-auto mb-6 h-[46px] relative">
            {gridStep === 'city' ? (`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/CustomerFlow.tsx', code);
