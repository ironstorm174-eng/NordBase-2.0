const fs = require('fs');

function updateFile(file, objectKey) {
  let code = fs.readFileSync(file, 'utf8');

  if (!code.includes("useTranslation")) {
    code = code.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { useTranslation } from 'react-i18next';");
    code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useTranslation } from 'react-i18next';");
  }
  
  if (!code.includes("const { t } = useTranslation();")) {
    const fnMatch = code.match(/export default function \w+\([^)]*\) \{/);
    if (fnMatch) {
      code = code.replace(fnMatch[0], fnMatch[0] + "\n  const { t } = useTranslation();");
    }
  }

  if (objectKey === 'operator') {
    code = code.replace(/>Operator Portal</g, ">{t('operator.dashboardTitle')}<");
    code = code.replace(/>Active Requests</g, ">{t('operator.activeRequests')}<");
    code = code.replace(/>History</g, ">{t('operator.history')}<");
    code = code.replace(/>New Request</g, ">{t('operator.newRequest')}<");
    code = code.replace(/placeholder="Search requests by ID, name, category\.\.\."/g, "placeholder={t('operator.searchPlaceholder')}");
    code = code.replace(/>Assign Specialist</g, ">{t('operator.assignSpecialist')}<");
  } else if (objectKey === 'specialist') {
    code = code.replace(/>Pro Cabinet</g, ">{t('specialist.dashboardTitle')}<");
    code = code.replace(/>Available Jobs</g, ">{t('specialist.availableJobs')}<");
    code = code.replace(/>My Jobs</g, ">{t('specialist.myJobs')}<");
    code = code.replace(/>Earnings</g, ">{t('specialist.earnings')}<");
    code = code.replace(/>Accept Job</g, ">{t('specialist.acceptJob')}<");
    code = code.replace(/>Complete Job</g, ">{t('specialist.completeJob')}<");
  }

  fs.writeFileSync(file, code);
}

updateFile('src/components/OperatorDashboard.tsx', 'operator');
updateFile('src/components/SpecialistDashboard.tsx', 'specialist');

