const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

code = code.replace(
  /const timingLabel = urgency === 'urgent'[\s\S]*?\: \`📆 Flexible Date \(\$\{preferredTimeSlot\}\)\`;/,
  `const timingLabel = urgency === 'urgent'
      ? \`⚡ \${t('flow.timingUrgent', 'Emergency (ASAP / Within 2 hours)')}\`
      : urgency === 'today'
      ? \`📅 \${t('flow.urgencyToday', 'Today')} (\${preferredTimeSlot})\`
      : urgency === 'tomorrow'
      ? \`🗓️ \${t('flow.urgencyTomorrow', 'Tomorrow')} (\${preferredTimeSlot})\`
      : \`📆 \${t('flow.urgencyFlexible', 'Flexible')} (\${preferredTimeSlot})\`;`
);

code = code.replace(
  /const contactLabel = preferredContact === 'whatsapp'[\s\S]*?\: '📞 Phone Call';/,
  `const contactLabel = preferredContact === 'whatsapp'
      ? '📱 WhatsApp'
      : preferredContact === 'telegram'
      ? '✈️ Telegram'
      : \`📞 \${t('flow.contactPhoneCall', 'Phone Call')}\`;`
);

code = code.replace(
  /<span>Call<\/span>/,
  `<span>{t('flow.contactCall', 'Call')}</span>`
);

fs.writeFileSync('src/components/CustomerFlow.tsx', code);
