const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

const targetStr = `            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Specific Location in {selectedDistrict || selectedCity}
              </label>
              <input
                id="customer-location-input"
                type="text"
                required
                placeholder="e.g. Alvor Marina, Block B Apt 412"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-blue-900/30 bg-slate-950/80 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none text-sm transition-all placeholder-slate-700"
              />
            </div>`;

const newStr = `            <div className="relative z-40">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Exact Address
              </label>
              <AddressAutocomplete
                value={specificLocation}
                onChange={setSpecificLocation}
                placeholder="e.g. Alvor Marina, Block B Apt 412"
                className="[&>input]:py-3.5 [&>input]:text-sm [&>input]:rounded-xl"
              />
            </div>`;

code = code.replace(targetStr, newStr);
fs.writeFileSync('src/components/CustomerFlow.tsx', code);
