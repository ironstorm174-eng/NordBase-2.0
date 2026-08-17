const fetch = require('node-fetch');

async function test() {
  const users = [
    {
      id: "u_" + Date.now(),
      email: "astrologforme@gmail.com",
      name: "Julia B",
      phone: "+351123123123",
      role: "regional_admin",
      specialistStatus: "approved",
      dashboardNumber: "PT-RD-001"
    }
  ];
  const res = await fetch('http://localhost:3000/api/users/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ users })
  });
  console.log(res.status, await res.text());
}
test();
