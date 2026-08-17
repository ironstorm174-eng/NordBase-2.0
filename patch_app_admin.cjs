const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  '<AdminDashboard \n            jobs={state.jobs} \n            specialists={state.specialists}\n            users={state.users}\n            inviteList={state.inviteList}\n            onCreateLead={handleSubmitRequest}\n            onApproveSpecialist={store.approveSpecialist.bind(store)}\n            onRejectSpecialist={store.rejectSpecialist.bind(store)}\n            onInviteOperator={store.inviteOperator.bind(store)}\n            onRemoveOperatorInvite={store.removeOperatorInvite.bind(store)}\n          />',
  `<AdminDashboard 
            jobs={state.jobs} 
            specialists={state.specialists}
            users={state.users}
            inviteList={state.inviteList}
            currentUser={state.currentUser}
            onCreateLead={handleSubmitRequest}
            onUpdateUsers={(updatedUsers) => {
              store.getState().users = updatedUsers;
              store.saveState();
              setState({ ...store.getState() });
            }}
            onApproveSpecialist={store.approveSpecialist.bind(store)}
            onRejectSpecialist={store.rejectSpecialist.bind(store)}
            onInviteOperator={store.inviteOperator.bind(store)}
            onRemoveOperatorInvite={store.removeOperatorInvite.bind(store)}
          />`
);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched.');
