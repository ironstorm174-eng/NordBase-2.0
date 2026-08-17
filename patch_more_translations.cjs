const fs = require('fs');

const ptFile = 'src/locales/pt/translation.json';
const enFile = 'src/locales/en/translation.json';

function addFlowKeys(filePath, newKeys) {
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  
  if (json.flow) {
    Object.assign(json.flow, newKeys);
  }
  
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

addFlowKeys(enFile, {
  "urgencyUrgent": "Urgent",
  "urgencyUrgentSub": "Within 2h",
  "urgencyToday": "Today",
  "urgencyTodaySub": "Later today",
  "urgencyTomorrow": "Tomorrow",
  "urgencyTomorrowSub": "Next day",
  "urgencyFlexible": "Flexible",
  "urgencyFlexibleSub": "Any day",
  "slotAnytime": "Anytime during the day",
  "slotMorning": "Morning (09:00 - 12:00)",
  "slotAfternoon": "Afternoon (12:00 - 17:00)",
  "slotEvening": "Evening (17:00 - 20:00)"
});

addFlowKeys(ptFile, {
  "urgencyUrgent": "Urgente",
  "urgencyUrgentSub": "Até 2h",
  "urgencyToday": "Hoje",
  "urgencyTodaySub": "Mais tarde hoje",
  "urgencyTomorrow": "Amanhã",
  "urgencyTomorrowSub": "No dia seguinte",
  "urgencyFlexible": "Flexível",
  "urgencyFlexibleSub": "Qualquer dia",
  "slotAnytime": "A qualquer hora do dia",
  "slotMorning": "Manhã (09:00 - 12:00)",
  "slotAfternoon": "Tarde (12:00 - 17:00)",
  "slotEvening": "Noite (17:00 - 20:00)"
});
