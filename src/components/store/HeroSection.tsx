import { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { HeroScene } from '@/components/store/HeroScene';
import { LightBeamButton } from '@/components/ui/LightBeamButton';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';

const heroImages = [hero1, hero2, hero3];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background images with horizontal scroll animation */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 animate-hero-pan"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        ))}
      </div>

      {/* Three.js floating shapes overlay */}
      <HeroScene />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-[2]" />

      {/* Content centered — animated on load */}
      <div className="relative z-10 flex h-full items-center justify-center" style={{ zIndex: 3 }}>
        <ScrollReveal animation="scale" duration={1000} threshold={0.05}>
          <a 
            href="#products"
            className="group"
          >
            <LightBeamButton className="rounded-md">
              Shop Now
            </LightBeamButton>
          </a>
        </ScrollReveal>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2" style={{ zIndex: 3 }}>
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
