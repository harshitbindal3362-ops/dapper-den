import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/database';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setOrder({
        ...data,
        items: (data.items as unknown as Order['items']) || [],
        shipping_address: (data.shipping_address as unknown as Order['shipping_address']),
      } as Order);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="text-center max-w-md px-4">
          <CheckCircle className="h-16 w-16 mx-auto text-success mb-6" />
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We'll send you an email with order details and payment instructions.
          </p>

          {order && (
            <div className="border border-border p-4 mb-6 text-left">
              <p className="text-sm">
                <span className="text-muted-foreground">Order ID:</span>{' '}
                <span className="font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
              </p>
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Amount:</span>{' '}
                <span className="font-medium">₹{order.total_amount.toLocaleString()}</span>
              </p>
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Payment:</span>{' '}
                <span className="font-medium">UPI (PhonePe / GPay / Paytm)</span>
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/account">View Order Details</Link>
            </Button>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
