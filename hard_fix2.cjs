const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I will find the block to remove completely:
const observerStart = `  // Chat Auto-Scroll Observer
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {`;
const observerEnd = `  }, []);

  return () => {`;

const startIndex = content.indexOf(observerStart);
const endIndex = content.indexOf(observerEnd);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + "\n    return () => {" + content.substring(endIndex + observerEnd.length);
}

const fixedObserver = `
  // Chat Auto-Scroll Observer
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const target = mutation.target;
          if (
            target && target.id && (
              target.id === 'customer-chat-history' || 
              target.id === 'specialist-chat-history' || 
              target.id === 'op-chat-history' ||
              target.id === 'superadmin-chat-history'
            )
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

// Now we need to insert it safely outside. Let's find:
//   // Listen to the store state changes
//   useEffect(() => {
// and insert it before that.

content = content.replace("  // Listen to the store state changes", fixedObserver + "\n  // Listen to the store state changes");

fs.writeFileSync('src/App.tsx', content);
