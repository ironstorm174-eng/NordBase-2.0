const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

const targetStr = `          <div className={\`w-full max-w-sm mx-auto relative \${gridStep === 'city' ? 'mb-6 h-[46px]' : 'hidden'}\`}>
            {gridStep === 'city' && (
              <div className="absolute inset-0">`;

const newStr = `          <div className={\`w-full max-w-sm mx-auto mb-6 h-[46px] relative transition-opacity duration-300 \${gridStep === 'city' ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}>
              <div className="absolute inset-0">`;

code = code.replace(targetStr, newStr);

const targetStr2 = `                  </button>
                )}
              </div>
            )}
          </div>`;

const newStr2 = `                  </button>
                )}
              </div>
          </div>`;

code = code.replace(targetStr2, newStr2);
fs.writeFileSync('src/components/CustomerFlow.tsx', code);
