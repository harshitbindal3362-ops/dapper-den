import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Address } from '@/types/database';
import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true);
  const [address, setAddress] = useState<Partial<Address>>({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!address.name || !address.phone || !address.address_line_1 || 
        !address.city || !address.state || !address.pincode) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return false;
    }

    if (!address.phone?.match(/^\+?[0-9]{10,15}$/)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive',
      });
      return false;
    }

    if (!address.pincode?.match(/^[0-9]{6}$/)) {
      toast({
        title: 'Invalid Pincode',
        description: 'Please enter a valid 6-digit pincode.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Cart is Empty',
        description: 'Please add items to your cart before checkout.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create order items
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images?.[0] || '',
        quantity: item.quantity,
        price: item.product.price,
        selected_color: item.selectedColor,
      }));

      // Create order
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: orderItems,
          total_amount: totalAmount,
          shipping_address: address,
          payment_method: 'upi',
          payment_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Update stock quantities
      for (const item of items) {
        await supabase
          .from('products')
          .update({ 
            stock_quantity: item.product.stock_quantity - item.quantity 
          })
          .eq('id', item.product.id);
      }

      // Save address to profile if requested
      if (saveAddress) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('addresses')
          .eq('user_id', user.id)
          .single();

        const existingAddresses = (profile?.addresses as unknown as Address[]) || [];
        const newAddress = { ...address, id: crypto.randomUUID() } as Address;
        const updatedAddresses = JSON.parse(JSON.stringify([...existingAddresses, newAddress]));

        await supabase
          .from('profiles')
          .update({
            addresses: updatedAddresses,
          })
          .eq('user_id', user.id);
      }

      clearCart();
      navigate(`/order-success/${order.id}`);

    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-4">Add some products to checkout.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />
      
      <main className="flex-1">
        <div className="container-narrow py-8">
          <h1 className="text-2xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Shipping Address */}
            <div>
              <h2 className="font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={address.name}
                      onChange={(e) => handleAddressChange('name', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address1">Address Line 1 *</Label>
                  <Input
                    id="address1"
                    value={address.address_line_1}
                    onChange={(e) => handleAddressChange('address_line_1', e.target.value)}
                    placeholder="House no., Building, Street"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input
                    id="address2"
                    value={address.address_line_2}
                    onChange={(e) => handleAddressChange('address_line_2', e.target.value)}
                    placeholder="Locality, Landmark"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={address.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="saveAddress"
                    checked={saveAddress}
                    onCheckedChange={(checked) => setSaveAddress(!!checked)}
                  />
                  <Label htmlFor="saveAddress" className="text-sm cursor-pointer">
                    Save this address for future orders
                  </Label>
                </div>
              </div>

              {/* Payment Info */}
              <div className="mt-8">
                <h2 className="font-semibold mb-4">Payment Method</h2>
                <div className="border border-border p-4">
                  <p className="font-medium">UPI Payment</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay using PhonePe, GPay, Paytm, or any UPI app
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    You will receive payment details after placing the order.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="font-semibold mb-4">Order Summary</h2>
              <div className="border border-border p-4 space-y-4">
                {items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.selectedColor}`}
                    className="flex gap-4"
                  >
                    <img
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                      {item.selectedColor && (
                        <p className="text-xs text-muted-foreground">
                          Color: {item.selectedColor}
                        </p>
                      )}
                      <p className="text-sm mt-1">
                        ₹{item.product.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={totalAmount >= 199 ? 'text-success' : ''}>
                      {totalAmount >= 199 ? 'FREE' : '₹49'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{(totalAmount + (totalAmount >= 199 ? 0 : 49)).toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full btn-primary py-6 text-base mt-4"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
