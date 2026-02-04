import { Link } from 'react-router-dom';
import { Product } from '@/types/database';
import { useCart } from '@/contexts/CartContext';

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
      <div className="product-card bg-card border border-border">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOnSale && !isOutOfStock && (
              <span className="bg-foreground text-background px-3 py-1 text-xs font-semibold rounded-sm">
                Sale
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-foreground text-background px-3 py-1 text-xs font-semibold rounded-sm">
                Sold out
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2 bg-secondary/50">
          <h3 className="font-medium text-sm uppercase tracking-wide line-clamp-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            {isOnSale && (
              <span className="text-muted-foreground line-through text-sm">
                Rs. {product.original_price?.toLocaleString()}
              </span>
            )}
            <span className="font-semibold text-foreground">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>

          {/* Stock status */}
          {isLowStock && (
            <p className="text-sale text-xs font-medium">Only {product.stock_quantity} left</p>
          )}

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full mt-3 py-2.5 text-sm font-medium border transition-colors ${
              isOutOfStock 
                ? 'border-border text-muted-foreground cursor-not-allowed' 
                : 'border-foreground text-foreground hover:bg-foreground hover:text-background'
            }`}
          >
            {isOutOfStock ? 'Sold out' : 'Add to cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
