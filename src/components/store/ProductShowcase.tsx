import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, RotateCw, Info } from 'lucide-react';
import { Product } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { ScrollReveal } from '@/components/ScrollReveal';

/* Lazy-load the 3D scene for performance */
const ShowcaseScene = lazy(() => import('./ShowcaseScene'));

/**
 * ProductShowcase — luxury fullscreen product spotlight.
 * 
 * Displays a featured product with a 3D rotating ring scene,
 * dark gradient background, and floating action icons.
 * 
 * Customize:
 *  - Change the gradient via CSS vars (--showcase-from, --showcase-to)
 *  - Swap the 3D geometry in ShowcaseScene.tsx
 *  - Adjust the product query below to pick a different featured item
 */
export function ProductShowcase() {
  const [product, setProduct] = useState<Product | null>(null);
  const [liked, setLiked] = useState(false);

  /* Fetch a single featured product to showcase */
  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(1)
        .single();
      if (data) setProduct(data as Product);
    };
    fetchFeatured();
  }, []);

  if (!product) return null;

  const isOnSale = product.original_price && product.original_price > product.price;

  return (
    <section className="relative w-full min-h-[80vh] md:min-h-[90vh] overflow-hidden bg-showcase flex items-center">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-showcase-from via-showcase-via to-showcase-to" />

      {/* Subtle radial glow behind the product */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-showcase-glow/20 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-narrow w-full py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left — Product info */}
          <ScrollReveal animation="slide-right" duration={900}>
            <div className="space-y-6 text-center lg:text-left">
              {isOnSale && (
                <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest bg-showcase-accent/20 text-showcase-accent border border-showcase-accent/30 rounded-full">
                  Limited Edition
                </span>
              )}
              
              {/* Product name — customize via database */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                {product.name}
              </h2>
              
              <p className="text-white/60 text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                {product.description || 'Crafted with precision. Designed to captivate.'}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <span className="text-3xl font-bold text-white">
                  ₹{product.price.toLocaleString()}
                </span>
                {isOnSale && (
                  <span className="text-lg text-white/40 line-through">
                    ₹{product.original_price?.toLocaleString()}
                  </span>
                )}
              </div>

              {/* CTA */}
              <Link
                to={`/product/${product.id}`}
                className="inline-block px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white bg-showcase-accent hover:bg-showcase-accent/80 transition-all duration-300 rounded-sm"
              >
                Shop Now
              </Link>
            </div>
          </ScrollReveal>

          {/* Right — 3D product scene */}
          <ScrollReveal animation="scale" duration={1000}>
            <div className="relative aspect-square max-w-[500px] mx-auto">
              {/* 3D Canvas */}
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </div>
              }>
                <ShowcaseScene />
              </Suspense>

              {/* Product image overlay (shows actual product image on top of 3D) */}
              {product.images?.[0] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-3/4 h-3/4 object-contain drop-shadow-2xl animate-showcase-float"
                  />
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Floating action icons — right side */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
        {[
          { icon: Heart, label: 'Like', active: liked, onClick: () => setLiked(!liked) },
          { icon: Eye, label: 'Views' },
          { icon: RotateCw, label: 'Rotate' },
          { icon: Info, label: 'Details' },
        ].map(({ icon: Icon, label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            title={label}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 border ${
              active
                ? 'bg-showcase-accent/30 border-showcase-accent text-showcase-accent'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        ))}
      </div>
    </section>
  );
}
