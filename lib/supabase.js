import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ถ้ายังไม่ตั้งค่า Supabase เว็บจะใช้ข้อมูลจากไฟล์ data/*.json แทนอัตโนมัติ
export const supabase = url && key ? createClient(url, key) : null;
