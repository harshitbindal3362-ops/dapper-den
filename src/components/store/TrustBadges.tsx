import { Lock, Truck, Gem, Wrench } from 'lucide-react';

const badges = [
  {
    icon: Lock,
    title: 'secure checkout',
    description: 'Safe and easy shopping experience just a click away!',
  },
  {
    icon: Truck,
    title: 'free delivery',
    description: 'Enjoy Stress-Free Shopping with Free and Fast Shipping in Just 4-7 Days!',
  },
  {
    icon: Gem,
    title: 'high quality',
    description: 'All our accessories are crafted with premium stainless steel',
  },
  {
    icon: Wrench,
    title: 'easy returns',
    description: '7-day hassle-free return and replacement policy',
  },
];

export function TrustBadges() {
  return (
    <section className="section-spacing border-t border-border">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {badges.map((badge) => (
          <div key={badge.title} className="text-center">
            <badge.icon className="h-10 w-10 mx-auto mb-4 text-foreground" strokeWidth={1.5} />
            <h4 className="font-bold italic text-base mb-2">{badge.title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">{badge.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
