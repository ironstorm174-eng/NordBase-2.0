const fs = require('fs');

let addressCode = fs.readFileSync('src/components/AddressAutocomplete.tsx', 'utf8');

if (!addressCode.includes("userLocation")) {
  addressCode = addressCode.replace(
    "interface AddressAutocompleteProps {",
    "interface AddressAutocompleteProps {\n  userLocation?: { lat: number, lon: number } | null;"
  );
  
  addressCode = addressCode.replace(
    "export function AddressAutocomplete({ value, onChange, placeholder = \"\", className = \"\", required = false }: AddressAutocompleteProps) {",
    "export function AddressAutocomplete({ value, onChange, placeholder = \"\", className = \"\", required = false, userLocation = null }: AddressAutocompleteProps) {"
  );
  
  addressCode = addressCode.replace(
    "fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lat=37.1&lon=-8.3`);",
    "fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5${userLocation ? `&lat=${userLocation.lat}&lon=${userLocation.lon}` : '&lat=39.3999&lon=-8.2245'}`);" // Center of Portugal as fallback
  );
  
  // Add a "Locate me" button
  addressCode = addressCode.replace(
    "<MapPin className=\"h-5 w-5 text-cyan-500\" />",
    "<MapPin className=\"h-5 w-5 text-cyan-500\" />"
  );
  
  // We can add a locate button inside the right side if query is empty
  const rightSideSearch = "{query && (";
  const rightSideReplacement = `
        {!query && (
          <button
            onClick={() => {
              if (navigator.geolocation) {
                setLoading(true);
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    try {
                      const res = await fetch(\`https://photon.komoot.io/api/?q=Portugal&limit=1&lat=\${pos.coords.latitude}&lon=\${pos.coords.longitude}\`);
                      const data = await res.json();
                      if (data.features && data.features.length > 0) {
                        const props = data.features[0].properties;
                        const parts = [props.name, props.street, props.city].filter(Boolean);
                        const suggested = Array.from(new Set(parts)).join(', ');
                        setQuery(suggested);
                        onChange(suggested);
                        setIsConfirmed(true);
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setLoading(false);
                    }
                  },
                  () => setLoading(false)
                );
              }
            }}
            className="text-cyan-500 hover:text-cyan-400 bg-cyan-500/10 p-1.5 rounded-lg transition-colors border border-cyan-500/20"
            type="button"
            title="Use my current location"
          >
            <MapPin className="h-4 w-4" />
          </button>
        )}
        {query && (`;
        
  addressCode = addressCode.replace(rightSideSearch, rightSideReplacement);
  
  fs.writeFileSync('src/components/AddressAutocomplete.tsx', addressCode);
}
