import { writeFile } from 'fs/promises';
import path from 'path';

// บันทึกตำแหน่ง/ขนาดรูปจากโหมดปรับรูป — ใช้ได้เฉพาะตอนรันในเครื่อง (npm run dev)
export async function POST(req) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('disabled in production', { status: 403 });
  }
  const body = await req.json();
  const file = path.join(process.cwd(), 'data', 'service-layout.json');
  await writeFile(file, JSON.stringify(body, null, 1), 'utf-8');
  return Response.json({ ok: true });
}
