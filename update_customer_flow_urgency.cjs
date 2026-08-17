const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  /<span className="text-xs font-bold flex items-center gap-1">⚡ Urgent<\/span>\s*<span className="text-\[10px\] opacity-75 mt-0\.5">Within 2h<\/span>/g,
  '<span className="text-xs font-bold flex items-center gap-1">⚡ {t("flow.urgencyUrgent", "Urgent")}</span>\n                      <span className="text-[10px] opacity-75 mt-0.5">{t("flow.urgencyUrgentSub", "Within 2h")}</span>'
);

code = code.replace(
  /<span className="text-xs font-bold flex items-center gap-1">📅 Today<\/span>\s*<span className="text-\[10px\] opacity-75 mt-0\.5">Later today<\/span>/g,
  '<span className="text-xs font-bold flex items-center gap-1">📅 {t("flow.urgencyToday", "Today")}</span>\n                      <span className="text-[10px] opacity-75 mt-0.5">{t("flow.urgencyTodaySub", "Later today")}</span>'
);

code = code.replace(
  /<span className="text-xs font-bold flex items-center gap-1">🗓️ Tomorrow<\/span>\s*<span className="text-\[10px\] opacity-75 mt-0\.5">Next day<\/span>/g,
  '<span className="text-xs font-bold flex items-center gap-1">🗓️ {t("flow.urgencyTomorrow", "Tomorrow")}</span>\n                      <span className="text-[10px] opacity-75 mt-0.5">{t("flow.urgencyTomorrowSub", "Next day")}</span>'
);

code = code.replace(
  /<span className="text-xs font-bold flex items-center gap-1">📆 Flexible<\/span>\s*<span className="text-\[10px\] opacity-75 mt-0\.5">Any day<\/span>/g,
  '<span className="text-xs font-bold flex items-center gap-1">📆 {t("flow.urgencyFlexible", "Flexible")}</span>\n                      <span className="text-[10px] opacity-75 mt-0.5">{t("flow.urgencyFlexibleSub", "Any day")}</span>'
);

code = code.replace(
  /<option value="anytime">Anytime during the day<\/option>/g,
  '<option value="anytime">{t("flow.slotAnytime", "Anytime during the day")}</option>'
);
code = code.replace(
  /<option value="morning">Morning \(09:00 - 12:00\)<\/option>/g,
  '<option value="morning">{t("flow.slotMorning", "Morning (09:00 - 12:00)")}</option>'
);
code = code.replace(
  /<option value="afternoon">Afternoon \(12:00 - 17:00\)<\/option>/g,
  '<option value="afternoon">{t("flow.slotAfternoon", "Afternoon (12:00 - 17:00)")}</option>'
);
code = code.replace(
  /<option value="evening">Evening \(17:00 - 20:00\)<\/option>/g,
  '<option value="evening">{t("flow.slotEvening", "Evening (17:00 - 20:00)")}</option>'
);

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
