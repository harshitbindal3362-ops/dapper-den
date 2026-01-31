import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Order, Profile } from '@/types/database';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AccountPage() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileData) {
      setProfile({
        ...profileData,
        addresses: (profileData.addresses as unknown as Profile['addresses']) || [],
      } as Profile);
    }

    // Fetch orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersData) {
      setOrders(ordersData.map(order => ({
        ...order,
        items: (order.items as unknown as Order['items']) || [],
        shipping_address: (order.shipping_address as unknown as Order['shipping_address']),
      })) as Order[]);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'shipped':
        return 'bg-blue-500 text-white';
      case 'processing':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
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
      <CartDrawer />
      
      <main className="flex-1">
        <div className="container-narrow py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">My Account</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <Button onClick={() => navigate('/admin')} variant="outline">
                  Admin Panel
                </Button>
              )}
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="border border-border p-6 mb-8">
            <h2 className="font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium">{profile?.phone || 'Not set'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{profile?.email || user?.email}</p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div>
            <h2 className="font-semibold mb-4">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="border border-border p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button onClick={() => navigate('/')} variant="outline">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm mt-1">
                          {order.items.length} item(s) • ₹{order.total_amount.toLocaleString()}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        View <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>

                    {/* Order tracking */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => {
                          const stepIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status);
                          const isCompleted = index <= stepIndex;
                          const isCurrent = step === order.status;
                          
                          return (
                            <div key={step} className="flex items-center">
                              <div className={`flex flex-col items-center ${index > 0 ? 'ml-2' : ''}`}>
                                <div className={`w-3 h-3 rounded-full ${
                                  isCompleted ? 'bg-foreground' : 'bg-muted'
                                }`} />
                                <span className={`text-xs mt-1 capitalize ${
                                  isCurrent ? 'font-semibold' : 'text-muted-foreground'
                                }`}>
                                  {step}
                                </span>
                              </div>
                              {index < 3 && (
                                <div className={`w-8 sm:w-12 h-0.5 mt-[-12px] ${
                                  index < stepIndex ? 'bg-foreground' : 'bg-muted'
                                }`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
