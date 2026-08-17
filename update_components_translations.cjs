const fs = require('fs');

function updateFlow() {
  let code = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');
  
  code = code.replace(/>Select Location & Service</g, ">{t('flow.step1Title')}<");
  code = code.replace(/>Describe the Request</g, ">{t('flow.step2Title')}<");
  code = code.replace(/>Direct Coordination</g, ">{t('flow.step3Title')}<");
  
  code = code.replace(/>Back</g, ">{t('flow.back')}<");
  code = code.replace(/>Submit Request</g, ">{t('flow.submitRequest')}<");
  
  code = code.replace(/>Territorial Partner \(TP\) Identified</g, ">{t('flow.tpIdentified')}<");
  code = code.replace(/Territorial Partner TP for \{geoMatch\?.fullName \|\| 'Portimão \(Algarve\)'\}/g, "{t('flow.tpFor')} {geoMatch?.fullName || 'Portimão (Algarve)'}");
  code = code.replace(/>Quick Territory Partner Contacts</g, ">{t('flow.quickTpContacts')}<");
  code = code.replace(/>WhatsApp Partner</g, ">{t('flow.whatsappPartner')}<");
  code = code.replace(/>Call Partner</g, ">{t('flow.callPartner')}<");
  code = code.replace(/>Sign in with Google</g, ">{t('flow.googleSignIn')}<");
  
  code = code.replace(/>Request Submitted</g, ">{t('flow.statusSubmitted')}<");
  code = code.replace(/>Territory Partner Review</g, ">{t('flow.statusReview')}<");
  code = code.replace(/>Specialist Match</g, ">{t('flow.statusMatch')}<");
  code = code.replace(/>Broadcasting to network\.\.\.</g, ">{t('flow.statusBroadcasting')}<");
  code = code.replace(/>Resolution</g, ">{t('flow.statusResolution')}<");
  
  code = code.replace(/>Job Status:</g, ">{t('flow.jobStatus')}<");
  code = code.replace(/>Est. Duration:</g, ">{t('flow.estDuration')}<");
  code = code.replace(/>Fixed Contract Price:</g, ">{t('flow.fixedPrice')}<");
  
  fs.writeFileSync('src/components/CustomerFlow.tsx', code);
}

function updateAuth() {
  let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');
  
  if (!code.includes("useTranslation")) {
    code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useTranslation } from 'react-i18next';");
  }
  if (!code.includes("const { t } = useTranslation();")) {
    const fnMatch = code.match(/export default function LoginScreen\([^)]*\) \{/);
    if (fnMatch) {
      code = code.replace(fnMatch[0], fnMatch[0] + "\n  const { t } = useTranslation();");
    }
  }

  code = code.replace(/>Change Role</g, ">{t('auth.changeRole')}<");
  code = code.replace(/>Access Workspace</g, ">{t('auth.accessWorkspace')}<");
  code = code.replace(/>Password Requirements:</g, ">{t('auth.passwordReqs')}<");
  code = code.replace(/>Minimum 8 characters</g, ">{t('auth.minChars')}<");
  code = code.replace(/>Must contain letters and numbers</g, ">{t('auth.lettersAndNumbers')}<");
  
  fs.writeFileSync('src/components/LoginScreen.tsx', code);
}

function updateAddress() {
  let code = fs.readFileSync('src/components/AddressAutocomplete.tsx', 'utf8');
  
  if (!code.includes("useTranslation")) {
    code = code.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { useTranslation } from 'react-i18next';");
  }
  if (!code.includes("const { t } = useTranslation();")) {
    const fnMatch = code.match(/export function AddressAutocomplete\([^)]*\) \{/);
    if (fnMatch) {
      code = code.replace(fnMatch[0], fnMatch[0] + "\n  const { t } = useTranslation();");
    }
  }

  code = code.replace(/placeholder = "Enter your exact address..."/g, 'placeholder = ""');
  code = code.replace(/placeholder=\{placeholder\}/g, "placeholder={placeholder || t('address.placeholder')}");
  
  code = code.replace(/>Searching addresses\.\.\.</g, ">{t('address.searching')}<");
  code = code.replace(/>Don't see your house number\?</g, ">{t('address.missingNumber')}<");
  code = code.replace(/> Select your street, then type the house, block, or apartment number manually\.</g, "> {t('address.missingNumberTip')}<");
  code = code.replace(/Use entered address: "\{query\}"/g, "{t('address.useEntered')} \"{query}\"");
  code = code.replace(/>Saved</g, ">{t('address.saved')}<");
  code = code.replace(/>Confirm</g, ">{t('address.confirm')}<");
  code = code.replace(/>Address saved! You can still type to edit or add block\/apartment details\.</g, ">{t('address.savedHint')}<");
  code = code.replace(/>Click the "Confirm" button or press Enter to lock in this address\.</g, ">{t('address.confirmHint')}<");
  code = code.replace(/>Type your address, select from suggestions, and append house\/apartment number\.</g, ">{t('address.typeHint')}<");
  
  fs.writeFileSync('src/components/AddressAutocomplete.tsx', code);
}

updateFlow();
updateAuth();
updateAddress();
