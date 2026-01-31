import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order, Address, OrderItem } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const mappedOrders = (data || []).map(order => ({
        ...order,
        items: (order.items as unknown as OrderItem[]) || [],
        shipping_address: (order.shipping_address as unknown as Address),
      })) as Order[];
      setOrders(mappedOrders);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Order status updated' });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
    }
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber })
      .eq('id', orderId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Tracking number updated' });
      fetchOrders();
    }
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

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">{orders.length} orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Order ID</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Items</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="p-3 font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {order.items.length} item(s)
                    </td>
                    <td className="p-3 font-medium">
                      ₹{order.total_amount.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewOrder(order)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order #{selectedOrder?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-3 p-3 border border-border">
                      <img
                        src={item.product_image || '/placeholder.svg'}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        {item.selected_color && (
                          <p className="text-sm text-muted-foreground">
                            Color: {item.selected_color}
                          </p>
                        )}
                        <p className="text-sm">
                          ₹{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="p-3 border border-border text-sm">
                  <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                  <p>{selectedOrder.shipping_address.phone}</p>
                  <p className="mt-2">
                    {selectedOrder.shipping_address.address_line_1}
                    {selectedOrder.shipping_address.address_line_2 && (
                      <>, {selectedOrder.shipping_address.address_line_2}</>
                    )}
                  </p>
                  <p>
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}
                  </p>
                </div>
              </div>

              {/* Tracking Number */}
              <div>
                <h3 className="font-semibold mb-3">Tracking Number</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter tracking number"
                    defaultValue={selectedOrder.tracking_number || ''}
                    id="tracking"
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById('tracking') as HTMLInputElement;
                      updateTrackingNumber(selectedOrder.id, input.value);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t text-lg font-bold">
                <span>Total</span>
                <span>₹{selectedOrder.total_amount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
