const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

const dashInput = `                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  Dashboard Number
                                </div>
                                {canEdit ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      defaultValue={u.dashboardNumber || ""}
                                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 w-full"
                                      onBlur={(e) => {
                                        if (e.target.value !== u.dashboardNumber) {
                                          handleUpdateDashboardNumber(
                                            u.id,
                                            e.target.value,
                                            u.name
                                          );
                                        }
                                      }}
                                    />
                                    <Edit2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  </div>
                                ) : (
                                  <div className="text-slate-400">{u.dashboardNumber || "None"}</div>
                                )}
                              </div>
                              <div>`;

content = content.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">',
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">'
);

content = content.replace(
`                              <div>
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  Password`,
  dashInput + `
                                <div className="text-xs text-slate-500 font-bold mb-1">
                                  Password`
);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content);
