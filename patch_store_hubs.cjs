const fs = require('fs');

let storeContent = fs.readFileSync('src/store.ts', 'utf8');

// 1. Add INITIAL_HUBS import / definition
const initialHubsCode = `
export const INITIAL_HUBS: import('./types').TerritorialHub[] = [
  {
    id: "HUB-LIS-001",
    hubCode: "HUB-001",
    name: "Cascais & Sintra Central Hub",
    rdCode: "Pt-RD-001",
    region: "Big Lisboa",
    city: "Cascais",
    assignedDistricts: ["Cascais", "Sintra", "Oeiras", "Amadora"],
    createdAt: "2026-01-15T00:00:00.000Z",
    seats: [
      {
        seatId: "PT-OP-001-A",
        seatCode: "001-A",
        shiftName: "Shift 1 (08:00 - 16:00)",
        operatorId: "u_op_001_a",
        operatorName: "Manuel Silva (Cascais S1)",
        operatorPhone: "+351 912 111 001",
        operatorEmail: "op001a@nordbase.pt",
        status: "active",
        personalRevenue: 340,
        personalJobsProcessed: 12
      },
      {
        seatId: "PT-OP-001-B",
        seatCode: "001-B",
        shiftName: "Shift 2 (16:00 - 24:00)",
        operatorId: "u_op_001_b",
        operatorName: "Sofia Costa (Cascais S2)",
        operatorPhone: "+351 912 111 002",
        operatorEmail: "op001b@nordbase.pt",
        status: "active",
        personalRevenue: 280,
        personalJobsProcessed: 9
      },
      {
        seatId: "PT-OP-001-C",
        seatCode: "001-C",
        shiftName: "Relief Cover A",
        operatorId: "u_op_001_c",
        operatorName: "Pedro Alves (Cascais Cover)",
        operatorPhone: "+351 912 111 003",
        operatorEmail: "op001c@nordbase.pt",
        status: "active",
        personalRevenue: 190,
        personalJobsProcessed: 6
      },
      {
        seatId: "PT-OP-001-D",
        seatCode: "001-D",
        shiftName: "Relief Cover B",
        operatorId: "u_op_001_d",
        operatorName: "Rita Martins (Cascais Relief)",
        operatorPhone: "+351 912 111 004",
        operatorEmail: "op001d@nordbase.pt",
        status: "active",
        personalRevenue: 150,
        personalJobsProcessed: 5
      }
    ]
  },
  {
    id: "HUB-LIS-002",
    hubCode: "HUB-002",
    name: "Margem Sul Hub",
    rdCode: "Pt-RD-001",
    region: "Big Lisboa",
    city: "Almada",
    assignedDistricts: ["Almada", "Seixal", "Barreiro", "Montijo"],
    createdAt: "2026-01-20T00:00:00.000Z",
    seats: [
      { seatId: "PT-OP-002-A", seatCode: "002-A", shiftName: "Shift 1 (08:00 - 16:00)", operatorId: "u_op_002_a", operatorName: "João Santos (Margem Sul S1)", status: "active", personalRevenue: 210, personalJobsProcessed: 7 },
      { seatId: "PT-OP-002-B", seatCode: "002-B", shiftName: "Shift 2 (16:00 - 24:00)", operatorId: "u_op_002_b", operatorName: "Inês Ferreira (Margem Sul S2)", status: "active", personalRevenue: 180, personalJobsProcessed: 6 },
      { seatId: "PT-OP-002-C", seatCode: "002-C", shiftName: "Relief Cover A", operatorId: null, operatorName: null, status: "vacant", personalRevenue: 0, personalJobsProcessed: 0 },
      { seatId: "PT-OP-002-D", seatCode: "002-D", shiftName: "Relief Cover B", operatorId: null, operatorName: null, status: "vacant", personalRevenue: 0, personalJobsProcessed: 0 }
    ]
  },
  {
    id: "HUB-LISC-001",
    hubCode: "HUB-003",
    name: "Baixa & Historic Centre Hub",
    rdCode: "Pt-RD-002",
    region: "Lisboa City",
    city: "Lisboa",
    assignedDistricts: ["Baixa-Chiado", "Estrela", "Alcântara", "Santo António"],
    createdAt: "2026-02-01T00:00:00.000Z",
    seats: [
      { seatId: "PT-OP-003-A", seatCode: "003-A", shiftName: "Shift 1 (08:00 - 16:00)", operatorId: "u_op_003_a", operatorName: "Tiago Ribeiro (Historic S1)", status: "active", personalRevenue: 420, personalJobsProcessed: 14 },
      { seatId: "PT-OP-003-B", seatCode: "003-B", shiftName: "Shift 2 (16:00 - 24:00)", operatorId: "u_op_003_b", operatorName: "Ana Rocha (Historic S2)", status: "active", personalRevenue: 310, personalJobsProcessed: 10 },
      { seatId: "PT-OP-003-C", seatCode: "003-C", shiftName: "Relief Cover A", operatorId: "u_op_003_c", operatorName: "Dinis Pinto (Historic Cover)", status: "active", personalRevenue: 160, personalJobsProcessed: 5 },
      { seatId: "PT-OP-003-D", seatCode: "003-D", shiftName: "Relief Cover B", operatorId: null, operatorName: null, status: "vacant", personalRevenue: 0, personalJobsProcessed: 0 }
    ]
  },
  {
    id: "HUB-OPO-001",
    hubCode: "HUB-004",
    name: "Greater Porto Central Hub",
    rdCode: "Pt-RD-003",
    region: "Porto",
    city: "Porto",
    assignedDistricts: ["Porto", "Gaia", "Matosinhos"],
    createdAt: "2026-02-10T00:00:00.000Z",
    seats: [
      { seatId: "PT-OP-004-A", seatCode: "004-A", shiftName: "Shift 1 (08:00 - 16:00)", operatorId: "u_op_004_a", operatorName: "Gonçalo Neves (Porto S1)", status: "active", personalRevenue: 290, personalJobsProcessed: 9 },
      { seatId: "PT-OP-004-B", seatCode: "004-B", shiftName: "Shift 2 (16:00 - 24:00)", operatorId: "u_op_004_b", operatorName: "Mariana Dias (Porto S2)", status: "active", personalRevenue: 220, personalJobsProcessed: 7 },
      { seatId: "PT-OP-004-C", seatCode: "004-C", shiftName: "Relief Cover A", operatorId: null, operatorName: null, status: "vacant", personalRevenue: 0, personalJobsProcessed: 0 },
      { seatId: "PT-OP-004-D", seatCode: "004-D", shiftName: "Relief Cover B", operatorId: null, operatorName: null, status: "vacant", personalRevenue: 0, personalJobsProcessed: 0 }
    ]
  },
  {
    id: "HUB-FAO-001",
    hubCode: "HUB-005",
    name: "Portimão & Barlavento Hub",
    rdCode: "Pt-RD-004",
    region: "Algarve",
    city: "Portimão",
    assignedDistricts: ["Portimão", "Lagos", "Albufeira"],
    createdAt: "2026-02-15T00:00:00.000Z",
    seats: [
      { seatId: "PT-OP-005-A", seatCode: "005-A", shiftName: "Shift 1 (08:00 - 16:00)", operatorId: "user-super-01", operatorName: "Oleg (Portimão Seat 1)", status: "active", personalRevenue: 510, personalJobsProcessed: 18 },
      { seatId: "PT-OP-005-B", seatCode: "005-B", shiftName: "Shift 2 (16:00 - 24:00)", operatorId: "u_op_005_b", operatorName: "Lucia Mendes (Portimão S2)", status: "active", personalRevenue: 340, personalJobsProcessed: 11 },
      { seatId: "PT-OP-005-C", seatCode: "005-C", shiftName: "Relief Cover A", operatorId: null, operatorName: null, status: "vacant", personalRevenue: 0, personalJobsProcessed: 0 },
      { seatId: "PT-OP-005-D", seatCode: "005-D", shiftName: "Relief Cover B", operatorId: null, operatorName: null, status: "vacant", personalRevenue: 0, personalJobsProcessed: 0 }
    ]
  }
];
`;

if (!storeContent.includes('INITIAL_HUBS')) {
  storeContent = storeContent.replace(
    'export const INITIAL_AUDIT_LOGS: AuditLog[] = [];',
    'export const INITIAL_AUDIT_LOGS: AuditLog[] = [];\n' + initialHubsCode
  );

  storeContent = storeContent.replace(
    'suggestions: [],',
    'suggestions: [],\n  hubs: INITIAL_HUBS,'
  );

  // In loadState ensure state.hubs is set
  storeContent = storeContent.replace(
    'return state;\n        }',
    'if (!state.hubs || state.hubs.length === 0) { state.hubs = INITIAL_HUBS; }\n          return state;\n        }'
  );

  // Add Hub management methods in AppStore
  const hubMethods = `
  public getHubs(): import('./types').TerritorialHub[] {
    return this.state.hubs || INITIAL_HUBS;
  }

  public createTerritorialHub(
    name: string,
    region: string,
    city: string,
    rdCode: string,
    assignedDistricts: string[] = []
  ): import('./types').TerritorialHub {
    const currentHubs = this.state.hubs || INITIAL_HUBS;
    const hubIndex = (currentHubs.length + 1).toString().padStart(3, '0');
    const hubId = \`HUB-\${city.toUpperCase().slice(0, 3)}-\${hubIndex}\`;
    const hubCode = \`HUB-\${hubIndex}\`;

    const seatBaseNum = (currentHubs.length + 1).toString().padStart(3, '0');

    const shifts: ('Shift 1 (08:00 - 16:00)' | 'Shift 2 (16:00 - 24:00)' | 'Relief Cover A' | 'Relief Cover B')[] = [
      'Shift 1 (08:00 - 16:00)',
      'Shift 2 (16:00 - 24:00)',
      'Relief Cover A',
      'Relief Cover B'
    ];

    const seatSuffixes = ['A', 'B', 'C', 'D'];

    const newSeats: import('./types').HubSeat[] = seatSuffixes.map((s, idx) => {
      const seatId = \`PT-OP-\${seatBaseNum}-\${s}\`;
      const operatorName = \`TP Operator (\${name} - \${s})\`;
      
      // Auto-create matching TP user in users list
      const newUser: import('./types').AuthUser = {
        id: \`u_tp_\${seatId.toLowerCase().replace(/[^a-z0-9]/g, '')}\`,
        email: \`tp_\${seatId.toLowerCase().replace(/[^a-z0-9]/g, '')}@nordbase.pt\`,
        name: operatorName,
        phone: '+351 912 ' + Math.floor(100000 + Math.random() * 900000),
        role: 'operator',
        specialistStatus: 'not_requested',
        region: region,
        city: city,
        dashboardNumber: seatId,
        hubId: hubId,
        hubName: name,
        seatId: seatId,
        shiftName: shifts[idx],
        isNewUser: false
      };

      this.state.users.push(newUser);

      return {
        seatId,
        seatCode: \`\${seatBaseNum}-\${s}\`,
        shiftName: shifts[idx],
        operatorId: newUser.id,
        operatorName: newUser.name,
        operatorPhone: newUser.phone,
        operatorEmail: newUser.email,
        status: 'active',
        personalRevenue: 0,
        personalJobsProcessed: 0
      };
    });

    const newHub: import('./types').TerritorialHub = {
      id: hubId,
      hubCode,
      name,
      rdCode,
      region,
      city,
      assignedDistricts: assignedDistricts.length > 0 ? assignedDistricts : [city],
      seats: newSeats,
      createdAt: new Date().toISOString(),
      totalHubRevenue: 0,
      activeJobsCount: 0
    };

    this.state.hubs = [...currentHubs, newHub];
    this.saveState();
    this.notifyListeners();
    this.addAuditLog(
      'Territorial Hub Created',
      'SuperAdmin / 01',
      'super_admin',
      region,
      \`Provisioned Hub "\${name}" with 4 TP Seat Dashboards (\${newSeats.map(s => s.seatId).join(', ')})\`
    );

    return newHub;
  }
`;

  storeContent = storeContent.replace(
    'public stopImpersonation() {',
    hubMethods + '\n  public stopImpersonation() {'
  );

  fs.writeFileSync('src/store.ts', storeContent);
  console.log('Successfully patched store with INITIAL_HUBS and Hub management methods');
}
