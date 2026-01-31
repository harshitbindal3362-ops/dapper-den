import { Product } from '@/types/database';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export function ProductGrid({ products, title, showViewAll, viewAllLink }: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section-spacing">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold italic">{title}</h2>
          {showViewAll && viewAllLink && (
            <a href={viewAllLink} className="btn-primary text-xs">
              View all
            </a>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
