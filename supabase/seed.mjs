// เติมข้อมูลจาก data/*.json เข้า Supabase
// วิธีใช้: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node supabase/seed.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  console.error('ต้องตั้งค่า SUPABASE_URL และ SUPABASE_SERVICE_KEY ก่อน');
  process.exit(1);
}

const db = createClient(url, key);
const load = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url)));

const products = load('products.json').map((p, i) => ({ ...p, sort_order: i }));
const colors = load('colors.json');
const faq = load('faq.json');

for (const [table, rows] of [
  ['products', products],
  ['colors', colors],
  ['faq', faq],
]) {
  const { error } = await db.from(table).upsert(rows);
  if (error) {
    console.error(`ผิดพลาดที่ตาราง ${table}:`, error.message);
    process.exit(1);
  }
  console.log(`✓ ${table}: ${rows.length} แถว`);
}
console.log('เสร็จแล้ว');
