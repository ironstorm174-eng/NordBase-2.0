const fs = require('fs');
let code = fs.readFileSync('src/components/Academy.tsx', 'utf8');

if (!code.includes("useTranslation")) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useTranslation } from 'react-i18next';");
}
if (!code.includes("const { t } = useTranslation();")) {
  code = code.replace("export default function Academy() {", "export default function Academy() {\n  const { t } = useTranslation();");
}

code = code.replace(">NordBase Specialist Academy<", ">{t('academy.headerTitle')}<");
code = code.replace(">Official Certification & Training Portal. Complete required courses to unlock new services.<", ">{t('academy.headerSubtitle')}<");
code = code.replace(">Your Progress<", ">{t('academy.yourProgress')}<");
code = code.replace(">Approved Specialties<", ">{t('academy.approvedSpecialties')}<");
code = code.replace(">In Training<", ">{t('academy.inTraining')}<");
code = code.replace(">Pending Review<", ">{t('academy.pendingReview')}<");
code = code.replace('placeholder="Search courses, specialties..."', 'placeholder={t("academy.searchPlaceholder")}');
code = code.replace(">All Courses<", ">{t('academy.filterAll')}<");
code = code.replace(">Required<", ">{t('academy.filterRequired')}<");
code = code.replace(">Completed<", ">{t('academy.filterCompleted')}<");

fs.writeFileSync('src/components/Academy.tsx', code);
