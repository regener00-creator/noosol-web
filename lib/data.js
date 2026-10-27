import { supabase } from './supabase';
import localProducts from '@/data/products.json';
import localColors from '@/data/colors.json';
import localFaq from '@/data/faq.json';

// ดึงข้อมูลจาก Supabase ถ้าตั้งค่าไว้ / ถ้าไม่ ใช้ข้อมูลในไฟล์ (data/*.json)

export async function getProducts() {
  if (supabase) {
    const { data, error } = await supabase.from('products').select('*').order('sort_order');
    if (!error && data?.length) return data;
  }
  return localProducts;
}

export async function getProduct(code) {
  const all = await getProducts();
  return all.find((p) => p.code === decodeURIComponent(code));
}

export async function getColors() {
  if (supabase) {
    const { data, error } = await supabase.from('colors').select('*').order('no');
    if (!error && data?.length) return data;
  }
  return localColors;
}

export async function getFaq() {
  if (supabase) {
    const { data, error } = await supabase.from('faq').select('*').order('id');
    if (!error && data?.length) return data;
  }
  return localFaq;
}

export async function getGallery() {
  if (supabase) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data?.length) return data;
  }
  return Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    image: `/portfolio/work-${i + 1}.jpg`,
    title: '',
  }));
}
