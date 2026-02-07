import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import categoryNecklaces from '@/assets/category-necklaces.jpg';
import categoryBracelets from '@/assets/category-bracelets.jpg';
import categoryRings from '@/assets/category-rings.jpg';
import categoryGlasses from '@/assets/category-glasses.jpg';
import categoryBelts from '@/assets/category-belts.jpg';
import categoryEarrings from '@/assets/category-earrings.jpg';

const collections = [
  { name: 'Necklaces', image: categoryNecklaces, query: 'necklace' },
  { name: 'Bracelets', image: categoryBracelets, query: 'bracelet' },
  { name: 'Rings', image: categoryRings, query: 'ring' },
  { name: 'Glasses', image: categoryGlasses, query: 'glasses' },
  { name: 'Belts', image: categoryBelts, query: 'belt' },
  { name: 'Earrings', image: categoryEarrings, query: 'earring' },
];

export function Collections() {
  return (
    <section className="section-spacing">
      {/* Section title — customize text here */}
      <ScrollReveal animation="fade-up">
        <h2 className="text-3xl sm:text-4xl font-bold italic text-foreground mb-8">
          Collections
        </h2>
      </ScrollReveal>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Each collection card animates in with a stagger delay */}
        {collections.map((collection, index) => (
          <ScrollReveal 
            key={collection.name} 
            animation="fade-up" 
            delay={index * 100}
            duration={600}
          >
            <Link
              to={`/?search=${collection.query}`}
              className="group block"
            >
              <div className="bg-muted aspect-square overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center gap-2 mt-3 py-2">
                <span className="font-medium text-foreground group-hover:underline">
                  {collection.name}
                </span>
                <ArrowRight className="h-4 w-4 text-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
