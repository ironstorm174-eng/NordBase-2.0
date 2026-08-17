const fs = require('fs');
let content = fs.readFileSync('src/components/SpecialistOnboarding.tsx', 'utf-8');

const isMarketplaceCode = `  const isMarketplace = categories.some(c => ['Care', 'Lessons', 'Other'].includes(c.name));`;

if (!content.includes('const isMarketplace = categories.some')) {
  content = content.replace(/  const \[categories, setCategories\] = useState/, isMarketplaceCode + '\n  const [categories, setCategories] = useState');
}

const replacementStep1 = `{step === 1 && 'Let’s start with you!'}
                {step === 2 && 'What is your specialty?'}
                {step === 3 && 'Which languages do you speak?'}
                {step === 4 && (isMarketplace ? 'Set up your Marketplace Profile' : 'Tell us about your trade level')}
                {step === 5 && 'Verify your account'}
                {step === 6 && 'Where do you work?'}
                {step === 7 && 'Review and finish!'}`;

content = content.replace(/\{step === 1 && 'Let’s start with you!'\}[\s\S]*?\{step === 7 && 'Review and finish!'\}/, replacementStep1);


const replacementStep1Sub = `{step === 1 && 'Upload your profile photo and double check your WhatsApp number.'}
                {step === 2 && 'Select all services that you can perform beautifully.'}
                {step === 3 && 'Clients feel safer when they can communicate in their own language!'}
                {step === 4 && (isMarketplace ? 'Write an attractive description of your services. Your profile will be public in the NordBase Marketplace.' : 'Choose your experience level and describe your specialized tools.')}
                {step === 5 && 'Upload ID documents for fast verification by our regional partners.'}
                {step === 6 && 'Tell us your operating region and base city.'}
                {step === 7 && (isMarketplace ? 'Check everything. Click Submit to activate your free trial subscription!' : 'Check everything. Click Submit and start getting client leads!')}`;

content = content.replace(/\{step === 1 && 'Upload your profile photo and double check your WhatsApp number.'\}[\s\S]*?\{step === 7 && 'Check everything. Click Submit and start getting client leads!'\}/, replacementStep1Sub);

fs.writeFileSync('src/components/SpecialistOnboarding.tsx', content);
console.log('Done patching onboarding');
