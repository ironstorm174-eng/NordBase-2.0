const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The original listener code was:
const orig = `    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);`;

// I'll just remove EVERYTHING between window.addEventListener('offline', handleOffline); and window.removeEventListener('online', handleOnline);
const startStr = "    window.addEventListener('offline', handleOffline);";
const endStr = "      window.removeEventListener('online', handleOnline);";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex + startStr.length) + "\n\n    return () => {\n" + content.substring(endIndex);
}

// And also I see it added a second copy before return. I'll just remove all of them.
const observerRegex = /  \/\/ Chat Auto-Scroll Observer[\s\S]*?  }, \[\]\];/g;
const observerRegex2 = /  \/\/ Chat Auto-Scroll Observer[\s\S]*?  }, \[\]\);/g;
content = content.replace(observerRegex, '');
content = content.replace(observerRegex2, '');

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

// Insert it right before the first return
content = content.replace(/return \(/, fixedObserver + "\n  return (");

fs.writeFileSync('src/App.tsx', content);
