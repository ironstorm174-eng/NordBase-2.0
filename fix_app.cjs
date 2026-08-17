const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the wrongly placed useEffect
content = content.replace(/  \/\/ Chat Auto-Scroll Observer[\s\S]*?  }, \[\]\];/g, '');

const fixedObserver = `
  // Chat Auto-Scroll Observer
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const target = mutation.target;
          if (
            target.id === 'customer-chat-history' || 
            target.id === 'specialist-chat-history' || 
            target.id === 'op-chat-history' ||
            target.id === 'superadmin-chat-history'
          ) {
            target.scrollTop = target.scrollHeight;
          }
        }
      });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    return () => observer.disconnect();
  }, []);
`;

// Insert it right before the first return in the component
content = content.replace(/return \(/, fixedObserver + "\n  return (");

fs.writeFileSync('src/App.tsx', content);
