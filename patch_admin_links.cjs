const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const targetStr = `                            {(op.phone || op.whatsapp || op.telegram) && (
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {op.phone && \`📞 \${op.phone} \`}
                                {op.whatsapp && \`💬 WA: \${op.whatsapp} \`}
                                {op.telegram && \`✈️ TG: \${op.telegram}\`}
                              </p>
                            )}`;

const replaceStr = `                            {(op.phone || op.whatsapp || op.telegram) && (
                              <div className="flex gap-2 mt-1">
                                {op.phone && <span className="text-[10px] text-slate-500 font-mono">📞 {op.phone}</span>}
                                {op.whatsapp && <a href={\`https://wa.me/\${op.whatsapp.replace(/[^0-9]/g, '')}\`} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-500 hover:text-emerald-400 font-mono transition-colors">💬 WA: {op.whatsapp}</a>}
                                {op.telegram && <a href={\`https://t.me/\${op.telegram.replace('@', '')}\`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:text-blue-400 font-mono transition-colors">✈️ TG: {op.telegram}</a>}
                              </div>
                            )}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/AdminDashboard.tsx', code);
  console.log('AdminDashboard links patched');
} else {
  console.log('String not found in AdminDashboard');
}
