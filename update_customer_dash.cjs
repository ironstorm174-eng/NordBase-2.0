const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerDashboard.tsx', 'utf8');

if (!code.includes("useTranslation")) {
  code = code.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { useTranslation } from 'react-i18next';");
}
if (!code.includes("const { t } = useTranslation();")) {
  code = code.replace("export default function CustomerDashboard({\n  currentUser,", "export default function CustomerDashboard({\n  currentUser,\n  onClose\n}: CustomerDashboardProps) {\n  const { t } = useTranslation();\n");
  code = code.replace("  onClose\n}: CustomerDashboardProps) {", "");
}

code = code.replace(">Your Requests<", ">{t('customerDashboard.title')}<");
code = code.replace(">Active Jobs<", ">{t('customerDashboard.activeJobs')}<");
code = code.replace(">Completed Jobs<", ">{t('customerDashboard.completedJobs')}<");
code = code.replace(">You have no active requests at the moment.<", ">{t('customerDashboard.noActiveJobs')}<");

fs.writeFileSync('src/components/CustomerDashboard.tsx', code);
