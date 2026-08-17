const fs = require('fs');

const pt = JSON.parse(fs.readFileSync('src/locales/pt/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

pt.academy = {
  "headerTitle": "Academia de Especialistas NordBase",
  "headerSubtitle": "Certificação Oficial e Portal de Formação. Complete os cursos obrigatórios para desbloquear novos serviços.",
  "yourProgress": "O Seu Progresso",
  "approvedSpecialties": "Especialidades Aprovadas",
  "inTraining": "Em Formação",
  "pendingReview": "Revisão Pendente",
  "searchPlaceholder": "Pesquisar cursos, especialidades...",
  "filterAll": "Todos os Cursos",
  "filterRequired": "Obrigatório",
  "filterCompleted": "Concluído",
  "startCourse": "Iniciar Curso",
  "continueCourse": "Continuar Curso",
  "takeExam": "Fazer Exame",
  "reviewPending": "Revisão Pendente",
  "completed": "Concluído"
};

en.academy = {
  "headerTitle": "NordBase Specialist Academy",
  "headerSubtitle": "Official Certification & Training Portal. Complete required courses to unlock new services.",
  "yourProgress": "Your Progress",
  "approvedSpecialties": "Approved Specialties",
  "inTraining": "In Training",
  "pendingReview": "Pending Review",
  "searchPlaceholder": "Search courses, specialties...",
  "filterAll": "All Courses",
  "filterRequired": "Required",
  "filterCompleted": "Completed",
  "startCourse": "Start Course",
  "continueCourse": "Continue Course",
  "takeExam": "Take Exam",
  "reviewPending": "Review Pending",
  "completed": "Completed"
};

fs.writeFileSync('src/locales/pt/translation.json', JSON.stringify(pt, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
