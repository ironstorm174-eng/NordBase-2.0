const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
`  } catch (err: any) {
    console.error('Error in /api/auth handler:', err);
    res.status(400).json({ error: err.message || 'Authentication failed on server' });
  }
});
  }
});`,
`  } catch (err: any) {
    console.error('Error in /api/auth handler:', err);
    res.status(400).json({ error: err.message || 'Authentication failed on server' });
  }
});`
);

fs.writeFileSync('server.ts', content);
