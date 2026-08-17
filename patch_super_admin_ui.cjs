const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const blockBtn = `                            {canEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleBlock(u.id, !!u.isBlocked, u.name);
                                }}
                                className={\`p-2 rounded-lg transition-colors \${u.isBlocked ? 'bg-red-500/20 text-red-400' : 'hover:bg-orange-500/20 text-slate-500 hover:text-orange-400'}\`}
                                title={u.isBlocked ? "Unblock partner" : "Block partner"}
                              >
                                <Lock className="w-5 h-5" />
                              </button>
                            )}
                            {canEdit && (
                              <button`;

content = content.replace(
`                            {canEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPartnerToDelete({ id: u.id, name: u.name });`,
  blockBtn + `
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPartnerToDelete({ id: u.id, name: u.name });`
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content);
