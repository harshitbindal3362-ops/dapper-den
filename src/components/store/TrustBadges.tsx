import { Lock, Truck, RefreshCw } from 'lucide-react';

export function TrustBadges() {
  return (
    <section className="section-spacing border-y border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        <div className="flex flex-col items-center text-center">
          <Lock className="h-8 w-8 mb-3" />
          <h3 className="font-semibold mb-1">Secure Checkout</h3>
          <p className="text-sm text-muted-foreground">
            Safe and easy shopping experience just a click away!
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Truck className="h-8 w-8 mb-3" />
          <h3 className="font-semibold mb-1">Free Delivery</h3>
          <p className="text-sm text-muted-foreground">
            Enjoy stress-free shopping! Fast shipping in just 5-7 days.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <RefreshCw className="h-8 w-8 mb-3" />
          <h3 className="font-semibold mb-1">Easy Exchange</h3>
          <p className="text-sm text-muted-foreground">
            Hassle-free exchanges within 48 hours of delivery.
          </p>
        </div>
      </div>
    </section>
  );
}
