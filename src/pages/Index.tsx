import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';
import { ProductGrid } from '@/components/store/ProductGrid';
import { TrustBadges } from '@/components/store/TrustBadges';
import { FAQ } from '@/components/store/FAQ';
import { WhatsAppButton } from '@/components/store/WhatsAppButton';
import { HeroSection } from '@/components/store/HeroSection';
import { Collections } from '@/components/store/Collections';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search');
  const filter = searchParams.get('filter');

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, filter]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    if (filter === 'featured') {
      query = query.eq('is_featured', true);
    } else if (filter === 'new') {
      query = query.eq('is_new_arrival', true);
    } else if (filter === 'under299') {
      query = query.lte('price', 299);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts((data as Product[]) || []);
    }
    setLoading(false);
  };

  const newArrivals = products.filter(p => p.is_new_arrival).slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <CartDrawer />
      <WhatsAppButton />
      
      <main className="flex-1">
        {/* Hero Section - only on homepage without filters */}
        {!searchQuery && !filter && <HeroSection />}

        <div id="products" className="container-narrow">
          {/* Page title for search/filter */}
          {(searchQuery || filter) && (
            <div className="py-6 border-b border-border">
              <h1 className="text-2xl font-bold">
                {searchQuery 
                  ? `Search results for "${searchQuery}"`
                  : filter === 'featured' 
                    ? 'Featured Products'
                    : filter === 'new'
                      ? 'New Arrivals'
                      : filter === 'under299'
                        ? 'Under ₹299'
                        : 'All Products'
                }
              </h1>
              <p className="text-muted-foreground mt-1">
                {products.length} products found
              </p>
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            </div>
          ) : (
            <>
              {/* Collections section - replaces ABSOLUTE CINEMA */}
              {!searchQuery && !filter && <Collections />}

              {!searchQuery && !filter && newArrivals.length > 0 && (
                <ProductGrid 
                  products={newArrivals} 
                  title="BEST SELLERS"
                  showViewAll
                  viewAllLink="/?filter=new"
                  carousel
                />
              )}

              <ProductGrid 
                products={products} 
                title={!searchQuery && !filter ? "ALL PRODUCTS" : undefined}
              />

              {products.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <Button onClick={() => window.location.href = '/'} variant="outline">
                    View All Products
                  </Button>
                </div>
              )}
            </>
          )}

          {!searchQuery && !filter && (
            <>
              <TrustBadges />
              <FAQ />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
