import http from 'http';

http.get('http://localhost:3000/api/data', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    console.log('Jobs:', parsed.jobs?.length);
    console.log('Users:', parsed.users?.length);
    console.log('Specialists:', parsed.specialists?.length);
  });
});
