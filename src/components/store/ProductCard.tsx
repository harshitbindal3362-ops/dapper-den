import { Link } from 'react-router-dom';
import { Product } from '@/types/database';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isOnSale = product.original_price && product.original_price > product.price;
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1, product.colors?.[0]);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="product-card bg-card">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOnSale && (
              <span className="badge-sale">Sale</span>
            )}
            {isOutOfStock && (
              <span className="badge-sold-out">Sold out</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-2">
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            {isOnSale && (
              <span className="price-original">₹{product.original_price?.toLocaleString()}</span>
            )}
            <span className="price-current">₹{product.price.toLocaleString()}</span>
          </div>

          {/* Stock status */}
          {isLowStock && (
            <p className="stock-low">Only {product.stock_quantity} left</p>
          )}

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            variant="outline"
            className={`w-full mt-2 ${isOutOfStock ? 'btn-sold-out' : 'btn-outline'}`}
          >
            {isOutOfStock ? 'Sold out' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </Link>
  );
}
