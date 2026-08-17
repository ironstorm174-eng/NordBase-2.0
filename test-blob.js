import { put } from '@vercel/blob';
const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.STORAGE_READ_WRITE_TOKEN;
try {
  const blob = await put('test.txt', 'hello', { access: 'private', token, addRandomSuffix: true });
  console.log(blob);
} catch (e) { console.error(e) }
