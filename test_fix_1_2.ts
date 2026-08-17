import { issueAuthToken, inMemoryUsers, inMemoryJobs } from './server.ts';

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('==================================================');
  console.log('NORDBASE FIX 1.2 — END-TO-END AUTHORIZATION & RBAC SUITE');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // Pre-seed in-memory store users for local testing
  const customerUser = { id: 'user-customer-test', email: 'cust@nordbase.pt', role: 'customer', name: 'Test Customer', phone: '+351910000001' };
  const specialistUser = { id: 'user-specialist-test', email: 'spec@nordbase.pt', role: 'specialist', name: 'Test Specialist', phone: '+351910000002' };
  const operatorUser = { id: 'user-operator-test', email: 'op@nordbase.pt', role: 'operator', name: 'Test Operator', dashboardNumber: 'HUB-01' };
  const superAdminUser = { id: 'user-superadmin-test', email: 'super@nordbase.pt', role: 'super_admin', name: 'Super Admin' };

  inMemoryUsers.push(customerUser, specialistUser, operatorUser, superAdminUser);

  // Generate valid signed JWT/tokens
  const customerToken = issueAuthToken(customerUser.id);
  const specialistToken = issueAuthToken(specialistUser.id);
  const operatorToken = issueAuthToken(operatorUser.id);
  const superAdminToken = issueAuthToken(superAdminUser.id);

  console.log('Testing Endpoint Protection...\n');

  // 1. POST /api/translate
  {
    const resUnauth = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hello', targetLanguage: 'pt' })
    });
    assert(resUnauth.status === 401, 'POST /api/translate without token returns 401');

    const resAuth = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ text: 'Hello', targetLanguage: 'pt' })
    });
    assert(resAuth.status === 200, 'POST /api/translate with valid token returns 200');
  }

  // 2. POST /api/translate/glossary-recommendations/approve
  {
    const resCustomer = await fetch(`${BASE_URL}/api/translate/glossary-recommendations/approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ id: 'rec-1', term: 'Test Term' })
    });
    assert(resCustomer.status === 403, 'POST /api/translate/glossary-recommendations/approve rejects Customer with 403');

    const resOp = await fetch(`${BASE_URL}/api/translate/glossary-recommendations/approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${operatorToken}`
      },
      body: JSON.stringify({ id: 'rec-1', term: 'Test Term' })
    });
    assert(resOp.status === 200, 'POST /api/translate/glossary-recommendations/approve allows Operator with 200');
  }

  // 3. POST /api/partner-applications/:id/status
  {
    const resUnauth = await fetch(`${BASE_URL}/api/partner-applications/app-1/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    });
    assert(resUnauth.status === 401, 'POST /api/partner-applications/:id/status without token returns 401');

    const resCust = await fetch(`${BASE_URL}/api/partner-applications/app-1/status`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ status: 'approved' })
    });
    assert(resCust.status === 403, 'POST /api/partner-applications/:id/status rejects Customer with 403');

    const resAdmin = await fetch(`${BASE_URL}/api/partner-applications/app-1/status`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${superAdminToken}`
      },
      body: JSON.stringify({ status: 'approved' })
    });
    assert(resAdmin.status === 200, 'POST /api/partner-applications/:id/status allows Super Admin with 200');
  }

  // 4. POST /api/users/update
  {
    // Customer updating someone else
    const resSpoof = await fetch(`${BASE_URL}/api/users/update`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        users: [{ id: 'user-specialist-test', name: 'Hacked Name' }]
      })
    });
    assert(resSpoof.status === 403, 'POST /api/users/update prevents Customer from updating another user account (403)');

    // Customer updating self with role escalation attempt
    const resEscalate = await fetch(`${BASE_URL}/api/users/update`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        users: [{ id: 'user-customer-test', role: 'super_admin', name: 'Escalated Customer' }]
      })
    });
    assert(resEscalate.status === 200, 'POST /api/users/update accepts self update');
    const updatedCust = inMemoryUsers.find(u => u.id === 'user-customer-test');
    assert(updatedCust?.role === 'customer', 'POST /api/users/update prevents role escalation (role remains "customer")');
  }

  // 5. DELETE /api/users/:id
  {
    const resCustDel = await fetch(`${BASE_URL}/api/users/user-specialist-test`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    assert(resCustDel.status === 403, 'DELETE /api/users/:id rejects Customer with 403');

    const resAdminDel = await fetch(`${BASE_URL}/api/users/user-specialist-test`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${superAdminToken}` }
    });
    assert(resAdminDel.status === 200, 'DELETE /api/users/:id allows Super Admin with 200');
  }

  // 6. POST /api/onboard
  {
    const resOnboardSpoof = await fetch(`${BASE_URL}/api/onboard`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ userId: 'user-superadmin-test', role: 'customer', name: 'Spoofed Onboard' })
    });
    assert(resOnboardSpoof.status === 403, 'POST /api/onboard prevents onboarding another user ID (403)');

    const resRoleEscalation = await fetch(`${BASE_URL}/api/onboard`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ userId: 'user-customer-test', role: 'super_admin', name: 'Customer' })
    });
    assert(resRoleEscalation.status === 403, 'POST /api/onboard prevents self-assigning super_admin role (403)');
  }

  // 7. POST /api/jobs & POST /api/jobs/:id/update
  {
    // Pre-seed a job belonging to customerUser
    const testJob = {
      id: 'job-ownership-test',
      category: 'Plumbing',
      city: 'Lisbon',
      customerId: 'user-customer-test',
      customerName: 'Test Customer',
      customerPhone: '+351910000001',
      status: 'pending_coordinator',
      unlockedBySpecialistId: null,
      messages: []
    };
    inMemoryJobs.push(testJob);

    // Specialist trying to update un-owned job
    const resSpecUpdate = await fetch(`${BASE_URL}/api/jobs/job-ownership-test/update`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${specialistToken}`
      },
      body: JSON.stringify({ status: 'completed' })
    });
    assert(resSpecUpdate.status === 403, 'POST /api/jobs/:id/update rejects unauthorized specialist (403)');
  }

  // 8. POST /api/jobs/:id/messages
  {
    const resUnauthMsg = await fetch(`${BASE_URL}/api/jobs/job-ownership-test/messages`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${specialistToken}`
      },
      body: JSON.stringify({ content: 'Hello', senderName: 'Spoofed Specialist' })
    });
    assert(resUnauthMsg.status === 403, 'POST /api/jobs/:id/messages rejects non-participant (403)');

    const resCustMsg = await fetch(`${BASE_URL}/api/jobs/job-ownership-test/messages`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ content: 'Owner message', senderName: 'Fake Name' })
    });
    assert(resCustMsg.status === 200, 'POST /api/jobs/:id/messages allows job owner (200)');
    const createdMsg = await resCustMsg.json();
    assert(createdMsg.senderName === 'Test Customer', 'Message senderName enforced from server session');
  }

  // 9. POST /api/specialists/:id/action
  {
    const resSpecApprove = await fetch(`${BASE_URL}/api/specialists/user-specialist-test/action`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${specialistToken}`
      },
      body: JSON.stringify({ action: 'approve' })
    });
    assert(resSpecApprove.status === 403, 'POST /api/specialists/:id/action rejects specialist trying to self-approve (403)');

    const resOpApprove = await fetch(`${BASE_URL}/api/specialists/user-specialist-test/action`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${operatorToken}`
      },
      body: JSON.stringify({ action: 'approve' })
    });
    assert(resOpApprove.status === 200, 'POST /api/specialists/:id/action allows operator to approve (200)');
  }

  // 10. POST /api/upload
  {
    const resUnauthUpload = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'test.pdf', base64: 'SGVsbG8=' })
    });
    assert(resUnauthUpload.status === 401, 'POST /api/upload without token returns 401');

    const resAuthUpload = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({ filename: 'test.pdf', base64: 'SGVsbG8=' })
    });
    assert(resAuthUpload.status === 200, 'POST /api/upload with valid token returns 200');
  }

  console.log('\n--------------------------------------------------');
  console.log(`FIX 1.2 Verification Summary: ${passed} Passed, ${failed} Failed`);
  console.log('--------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
