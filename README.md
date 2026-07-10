# NOOSOL — เว็บไซต์ใหม่

เว็บไซต์ noosol.com เวอร์ชันใหม่ สร้างด้วย Next.js + Tailwind ดีไซน์สไตล์ Mobbin (ขาวสะอาด ตัวหนังสือใหญ่)

## โครงสร้าง

- `app/` — หน้าเว็บทั้งหมด (หน้าแรก, สินค้า, ตารางราคา, ผลงาน, Q&A, ติดต่อเรา)
- `data/` — ข้อมูลสินค้า ราคา สี FAQ (ไฟล์ JSON — เว็บใช้ไฟล์นี้ถ้ายังไม่ต่อ Supabase)
- `public/` — รูปภาพทั้งหมด
- `supabase/schema.sql` — สคริปต์สร้างตารางใน Supabase
- `supabase/seed.mjs` — สคริปต์เติมข้อมูลจาก data/ เข้า Supabase
- `lib/site.js` — ข้อมูลติดต่อร้าน (LINE, โทร, Facebook, Shopee) แก้ที่นี่ที่เดียว

## รันในเครื่อง

```bash
npm install
npm run dev
```

## เชื่อม Supabase (เก็บข้อมูลสินค้า/ราคา)

1. สร้างโปรเจกต์ที่ supabase.com
2. ไปที่ SQL Editor แล้วรันไฟล์ `supabase/schema.sql`
3. เติมข้อมูล: `SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node supabase/seed.mjs`
4. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ URL + anon key

ถ้าไม่ตั้งค่า Supabase เว็บจะใช้ข้อมูลจาก `data/*.json` อัตโนมัติ (เว็บยังทำงานได้ปกติ)

## Deploy ขึ้น Vercel

1. อัปโหลดโปรเจกต์นี้ขึ้น GitHub (หรือใช้ `vercel` CLI)
2. ที่ vercel.com กด New Project แล้วเลือก repo นี้
3. ใส่ Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. กด Deploy
