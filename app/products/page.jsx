import { getProducts } from '@/lib/data';
import ProductGrid from '@/components/ProductGrid';

export const revalidate = 3600;

export const metadata = { title: 'สินค้าทั้งหมด' };

export default async function ProductsPage({ searchParams }) {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">สินค้าทั้งหมด</h1>
      <p className="mt-2 max-w-xl text-neutral-500">
        ถุงสปันบอนด์สต็อกพร้อมสกรีนโลโก้ กดที่รุ่นเพื่อดูตารางราคาแบบละเอียด
      </p>
      <div className="mt-8">
        <ProductGrid products={products} initialCat={searchParams?.cat ?? ''} />
      </div>
    </div>
  );
}
