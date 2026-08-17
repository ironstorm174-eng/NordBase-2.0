const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add react-router-dom imports
if (!code.includes("useNavigate")) {
  code = code.replace(
    "import { Helmet } from 'react-helmet-async';",
    "import { Helmet } from 'react-helmet-async';\nimport { useNavigate, useLocation } from 'react-router-dom';"
  );
}

// Add the sync hook inside App
const syncCode = `
  const navigate = useNavigate();
  const location = useLocation();

  // Sync URL to State (on mount and URL change)
  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/partner')) {
      if (!isPartnerPage) setIsPartnerPage(true);
    } else {
      if (isPartnerPage) setIsPartnerPage(false);
      
      if (path.startsWith('/pro')) {
        if (state.currentRole !== 'specialist') handleRoleChange('specialist');
      } else if (path.startsWith('/operator')) {
        if (state.currentRole !== 'operator') handleRoleChange('operator');
      } else if (path.startsWith('/admin')) {
        if (state.currentRole !== 'regional_admin') handleRoleChange('regional_admin');
      } else if (path.startsWith('/super-admin')) {
        if (state.currentRole !== 'super_admin') handleRoleChange('super_admin');
      } else if (path.startsWith('/dashboard')) {
        if (state.currentRole !== 'customer') handleRoleChange('customer');
        if (customerView !== 'dashboard') setCustomerView('dashboard');
      } else if (path.startsWith('/services/')) {
        const cat = path.split('/')[2];
        if (state.currentRole !== 'customer') handleRoleChange('customer');
        if (customerView !== 'menu') setCustomerView('menu');
        if (state.selectedCategory !== cat) handleSelectCategory(cat);
      } else if (path === '/') {
        if (state.currentRole !== 'customer') handleRoleChange('customer');
        if (customerView !== 'menu') setCustomerView('menu');
        if (state.selectedCategory !== null) handleSelectCategory(null);
      }
    }
  }, [location.pathname]);

  // Sync State to URL
  useEffect(() => {
    if (isPartnerPage) {
      if (location.pathname !== '/partner') navigate('/partner', { replace: true });
    } else if (state.currentRole === 'specialist') {
      if (location.pathname !== '/pro') navigate('/pro', { replace: true });
    } else if (state.currentRole === 'operator') {
      if (location.pathname !== '/operator') navigate('/operator', { replace: true });
    } else if (state.currentRole === 'regional_admin') {
      if (location.pathname !== '/admin') navigate('/admin', { replace: true });
    } else if (state.currentRole === 'super_admin') {
      if (location.pathname !== '/super-admin') navigate('/super-admin', { replace: true });
    } else if (state.currentRole === 'customer') {
      if (customerView === 'dashboard') {
        if (location.pathname !== '/dashboard') navigate('/dashboard', { replace: true });
      } else if (state.selectedCategory) {
        const expected = \`/services/\${state.selectedCategory}\`;
        if (location.pathname !== expected) navigate(expected, { replace: true });
      } else {
        if (location.pathname !== '/') navigate('/', { replace: true });
      }
    }
  }, [isPartnerPage, state.currentRole, customerView, state.selectedCategory]);
`;

if (!code.includes("useLocation()")) {
  code = code.replace("  const [state, setState] = useState<AppState>(store.getState());", "  const [state, setState] = useState<AppState>(store.getState());\n" + syncCode);
}

fs.writeFileSync('src/App.tsx', code);
