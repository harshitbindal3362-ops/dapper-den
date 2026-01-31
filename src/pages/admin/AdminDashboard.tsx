import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Fetch product count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Fetch order stats
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, created_at, status, id')
      .order('created_at', { ascending: false });

    // Fetch customer count
    const { count: customerCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    setStats({
      totalProducts: productCount || 0,
      totalOrders: orders?.length || 0,
      totalCustomers: customerCount || 0,
      totalRevenue,
    });

    setRecentOrders(orders?.slice(0, 5) || []);
    setLoading(false);
  };

  const statCards = [
    { 
      icon: Package, 
      label: 'Products', 
      value: stats.totalProducts,
      link: '/admin/products',
    },
    { 
      icon: ShoppingCart, 
      label: 'Orders', 
      value: stats.totalOrders,
      link: '/admin/orders',
    },
    { 
      icon: Users, 
      label: 'Customers', 
      value: stats.totalCustomers,
      link: '/admin/customers',
    },
    { 
      icon: TrendingUp, 
      label: 'Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      link: '/admin/orders',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your store admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="admin-card hover:border-foreground transition-colors"
          >
            <stat.icon className="h-5 w-5 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="admin-stat">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{Number(order.total_amount).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 ${
                    order.status === 'delivered' ? 'bg-success/20 text-success' :
                    order.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                    'bg-muted'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
