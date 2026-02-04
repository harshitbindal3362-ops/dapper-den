import { Product } from '@/types/database';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ProductGridProps {
  products: Product[];
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  carousel?: boolean;
}

export function ProductGrid({ products, title, showViewAll, viewAllLink, carousel = false }: ProductGridProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (products.length === 0) {
    return null;
  }

  const displayProducts = carousel 
    ? products.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : products;

  return (
    <section className="section-spacing">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold italic text-foreground">{title}</h2>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination / Carousel controls */}
      {carousel && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-muted-foreground">{page}/{totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {showViewAll && viewAllLink && (
        <div className="flex justify-center mt-8">
          <a 
            href={viewAllLink} 
            className="bg-foreground text-background px-8 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            View all
          </a>
        </div>
      )}
    </section>
  );
}
