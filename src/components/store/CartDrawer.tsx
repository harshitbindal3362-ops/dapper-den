import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    if (!user) {
      navigate('/auth?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="flex gap-4 p-3 border border-border"
                >
                  <Link 
                    to={`/product/${item.product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="shrink-0"
                  >
                    <img
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <Link 
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsOpen(false)}
                        className="font-medium text-sm line-clamp-2 hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {item.selectedColor && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Color: {item.selectedColor}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)}
                          disabled={item.quantity >= item.product.stock_quantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-semibold">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping calculated at checkout
              </p>
              <Button onClick={handleCheckout} className="w-full btn-primary">
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
