const fs = require('fs');
let code = fs.readFileSync('src/components/OperatorLeadsTerminal.tsx', 'utf8');

const replacements = [
  ['>+ Create Lead</', '>{t("op.createLead", "+ Create Lead")}</'],
  ['> new requests waiting</', '> {t("op.reqWaiting", "new requests waiting")}</'],
  [">Today's earnings (40% share)</", ">{t('op.todayEarnings', \"Today's earnings (40% share)\")}</"],
  ['>Completed leads:</', '>{t("op.completedLeads", "Completed leads:")}</'],
  ['>Avg. Territory Partner share:</', '>{t("op.avgShare", "Avg. Territory Partner share:")}</'],
  ['>Service Requests (', '>{t("op.serviceRequests", "Service Requests")} ('],
  ['>Newest first</', '>{t("op.newestFirst", "Newest first")}</'],
  ['>By urgency</', '>{t("op.byUrgency", "By urgency")}</'],
  ['>By cost</', '>{t("op.byCost", "By cost")}</'],
  ['>All categories</', '>{t("op.allCategories", "All categories")}</'],
  ['>No orders found.</', '>{t("op.noOrdersFound", "No orders found.")}</'],
  ['>No request selected</', '>{t("op.noRequestSelected", "No request selected")}</'],
  ['> on your keyboard or select any request from the left queue to begin work.</', '> {t("op.pressSpace", "on your keyboard or select any request from the left queue to begin work.")}</'],
  ['>Service address (Primary location)</', '>{t("op.serviceAddress", "Service address (Primary location)")}</'],
  ['>Customer name</', '>{t("op.customerName", "Customer name")}</'],
  ['>Contact phone</', '>{t("op.contactPhone", "Contact phone")}</'],
  ['>Request qualification & complexity</', '>{t("op.reqQual", "Request qualification & complexity")}</'],
  ['>Internal notes for dispatch team (Private)</', '>{t("op.internalNotes", "Internal notes for dispatch team (Private)")}</'],
  ['>Price & fee estimation</', '>{t("op.priceEst", "Price & fee estimation")}</'],
  ['>Lead fee (€)</', '>{t("op.leadFee", "Lead fee (€)")}</'],
  ['>Commission Amount</', '>{t("op.commAmount", "Commission Amount")}</'],
  ['>Assign Specialist</', '>{t("op.assignSpec", "Assign Specialist")}</'],
  ['>Send via WhatsApp</', '>{t("op.sendWA", "Send via WhatsApp")}</'],
  ['>Send to Web Chat</', '>{t("op.sendWebChat", "Send to Web Chat")}</'],
  ['>Transfer to other region</', '>{t("op.transferRegion", "Transfer to other region")}</'],
  ['>Finalize & Close Order</', '>{t("op.finalizeOrder", "Finalize & Close Order")}</'],
  ['>Customer chat</', '>{t("op.chatCustomer", "Customer chat")}</'],
  ['>Specialist chat</', '>{t("op.chatSpecialist", "Specialist chat")}</'],
  ['>Team note</', '>{t("op.teamNote", "Team note")}</'],
  ['>Quick reply:</', '>{t("op.quickReply", "Quick reply:")}</'],
  ['>"Calling now..."</', '>{t("op.callingNow", "\\"Calling now...\\"")}</'],
  ['>"Specialists notified..."</', '>{t("op.specNotified", "\\"Specialists notified...\\"")}</']
];

for (const [find, replace] of replacements) {
  code = code.split(find).join(replace);
}

fs.writeFileSync('src/components/OperatorLeadsTerminal.tsx', code);
