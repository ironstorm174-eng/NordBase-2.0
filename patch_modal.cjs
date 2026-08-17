const fs = require('fs');
let code = fs.readFileSync('src/components/CreateOrderModal.tsx', 'utf8');

// I also need to add useTranslation to CreateOrderModal.tsx if it isn't there.
if (!code.includes('useTranslation')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useTranslation } from 'react-i18next';");
  code = code.replace(/export default function CreateOrderModal\([^)]+\) \{/, "$&\n  const { t } = useTranslation();");
}

const replacements = [
  ['>Create New Dispatch Lead</', '>{t("op.modalTitle", "Create New Dispatch Lead")}</'],
  ['>Customer Name</', '>{t("op.modalName", "Customer Name")}</'],
  ['>Customer Phone</', '>{t("op.modalPhone", "Customer Phone")}</'],
  ['>City / Region</', '>{t("op.modalCity", "City / Region")}</'],
  ['>Exact Address / Locality</', '>{t("op.modalAddress", "Exact Address / Locality")}</'],
  ['>Service Category</', '>{t("op.modalCat", "Service Category")}</'],
  ['>Problem Description / Requirements</', '>{t("op.modalDesc", "Problem Description / Requirements")}</'],
  ['>Specialist Required Tools / Parts</', '>{t("op.modalTools", "Specialist Required Tools / Parts")}</'],
  ['>Attach Photos or Documents</', '>{t("op.modalPhotos", "Attach Photos or Documents")}</'],
  ['>Drag & drop photos or click to browse</', '>{t("op.modalDrag", "Drag & drop photos or click to browse")}</'],
  ['>Financial Configuration</', '>{t("op.modalFin", "Financial Configuration")}</'],
  ['>Estimated Job Value (€)</', '>{t("op.modalEst", "Estimated Job Value (€)")}</'],
  ['>Lead Price (€)</', '>{t("op.modalLead", "Lead Price (€)")}</'],
  ['>Routing Method</', '>{t("op.modalRouting", "Routing Method")}</'],
  ['>General Marketplace Broadcasting</', '>{t("op.modalGen", "General Marketplace Broadcasting")}</'],
  ['>Direct Personal Offer</', '>{t("op.modalDirect", "Direct Personal Offer")}</'],
  ['>Create Dispatch Lead</', '>{t("op.modalCreate", "Create Dispatch Lead")}</'],
  ['>Cancel</', '>{t("op.modalCancel", "Cancel")}</']
];

for (const [find, replace] of replacements) {
  code = code.split(find).join(replace);
}

fs.writeFileSync('src/components/CreateOrderModal.tsx', code);
