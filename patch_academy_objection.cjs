const fs = require('fs');
let content = fs.readFileSync('src/components/Academy.tsx', 'utf-8');

const target = `<h4 className="font-bold text-amber-400 mb-2">"Is the specialist licensed and insured?"</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Response:</strong> "Yes, all professionals on NordBase pass a strict verification process. We check their IDs and credentials before they can accept requests."
              </p>`;
const replacement = `<h4 className="font-bold text-amber-400 mb-2">"Is the specialist licensed and insured?"</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Response:</strong> "This is the responsibility of the specialist. The specialist, as an independent contractor, is directly responsible to the customer for the work and services provided, without intermediaries."
              </p>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Academy.tsx', content);
console.log('Done');
