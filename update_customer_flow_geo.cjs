const fs = require('fs');

let flowCode = fs.readFileSync('src/components/CustomerFlow.tsx', 'utf8');

if (!flowCode.includes("userLocation")) {
  flowCode = flowCode.replace(
    "const [specificLocation, setSpecificLocation] = useState('');",
    "const [specificLocation, setSpecificLocation] = useState('');\n  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);\n\n  useEffect(() => {\n    if (navigator.geolocation) {\n      navigator.geolocation.getCurrentPosition(\n        (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),\n        () => console.warn('Geolocation denied or failed')\n      );\n    }\n  }, []);"
  );
  
  flowCode = flowCode.replace(
    "onChange={(val) => {",
    "userLocation={userLocation}\n                  onChange={(val) => {"
  );
  
  fs.writeFileSync('src/components/CustomerFlow.tsx', flowCode);
}
