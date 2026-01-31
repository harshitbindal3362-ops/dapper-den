import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { useCart } from '@/contexts/CartContext';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/store/ProductGrid';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      navigate('/');
      return;
    }

    const productData = data as Product;
    setProduct(productData);
    setSelectedColor(productData.colors?.[0]);

    // Fetch related products
    const { data: related } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .neq('id', id)
      .limit(4);

    setRelatedProducts((related as Product[]) || []);
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product && product.stock_quantity > 0) {
      addToCart(product, quantity, selectedColor);
    }
  };

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isOnSale = product.original_price && product.original_price > product.price;
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />
      
      <main className="flex-1">
        <div className="container-narrow py-6 sm:py-12">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-muted overflow-hidden">
                <img
                  src={product.images?.[currentImageIndex] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {isOnSale && <span className="badge-sale">Sale</span>}
                  {isOutOfStock && <span className="badge-sold-out">Sold out</span>}
                </div>

                {/* Navigation arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`shrink-0 w-16 h-16 border-2 ${
                        index === currentImageIndex ? 'border-foreground' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
                
                {/* Price */}
                <div className="flex items-center gap-3 mt-3">
                  {isOnSale && (
                    <span className="price-original text-lg">
                      ₹{product.original_price?.toLocaleString()}
                    </span>
                  )}
                  <span className="text-2xl font-bold">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>

                {/* Stock status */}
                <div className="mt-2">
                  {isOutOfStock ? (
                    <span className="text-sale font-medium">Out of stock</span>
                  ) : isLowStock ? (
                    <span className="stock-low">Only {product.stock_quantity} left in stock</span>
                  ) : (
                    <span className="stock-available">In stock</span>
                  )}
                </div>
              </div>

              {/* Color selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Color: {selectedColor}
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="inline-flex items-center border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to cart */}
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-6 text-base ${isOutOfStock ? 'btn-sold-out' : 'btn-primary'}`}
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </Button>

              {/* Description */}
              {product.description && (
                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <ProductGrid 
              products={relatedProducts} 
              title="You May Also Like" 
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
