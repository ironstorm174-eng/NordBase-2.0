const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const delayLogic = `const failedAttempts = new Map<string, { count: number, lastAttempt: number }>();

app.post('/api/auth', async (req, res) => {
  try {
    const { email, phone, name, role, password, dashboardNumber, isRegistration } = req.body;
    const identifier = (email || phone || '').toLowerCase().trim();
    
    // Check rate limit delay
    const attemptInfo = failedAttempts.get(identifier);
    if (attemptInfo) {
      const timeSinceLast = Date.now() - attemptInfo.lastAttempt;
      const requiredDelay = Math.min(attemptInfo.count * 1000, 10000); // Max 10s delay
      if (timeSinceLast < requiredDelay) {
        await new Promise(resolve => setTimeout(resolve, requiredDelay - timeSinceLast));
      }
    }

    const userData = await authenticateOrRegisterUser(email, phone, name, role, password, dashboardNumber, isRegistration);
    
    if (userData.error) {
      // Increment failed attempt
      const newCount = (attemptInfo ? attemptInfo.count : 0) + 1;
      failedAttempts.set(identifier, { count: newCount, lastAttempt: Date.now() });
      return res.status(400).json(userData);
    }
    
    // Clear failed attempts on success
    failedAttempts.delete(identifier);
    
    res.json(userData);
  } catch (err: any) {
    console.error('Error in /api/auth handler:', err);
    res.status(400).json({ error: err.message || 'Authentication failed on server' });
  }
});`;

content = content.replace(
/app\.post\('\/api\/auth', async \(req, res\) => {[\s\S]*?\}\);/g,
  delayLogic
);

fs.writeFileSync('server.ts', content);
