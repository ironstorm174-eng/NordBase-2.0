const fs = require('fs');
let content = fs.readFileSync('src/components/LoginScreen.tsx', 'utf8');

content = content.replace(
`        const user = await onLoginSuccess(
          decoded.email,
          phone.trim() || '',
          userName,
          roleToUse
        );`,
`        const user = await onLoginSuccess(
          decoded.email,
          phone.trim() || '',
          userName,
          roleToUse,
          undefined,
          false,
          (expectedRole === 'operator' || expectedRole === 'regional_admin') ? adminDashboardNumber.trim() : undefined
        );`
);

fs.writeFileSync('src/components/LoginScreen.tsx', content);
