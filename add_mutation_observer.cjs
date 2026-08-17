const fs = require('fs');

function addGlobalObserver() {
  const file = 'src/App.tsx';
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes("Chat Auto-Scroll Observer")) return;
  
  const observerCode = `
  // Chat Auto-Scroll Observer
  React.useEffect(() => {
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
  
  content = content.replace("return (", observerCode + "\n  return (");
  fs.writeFileSync(file, content);
}

addGlobalObserver();
