import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-narrow py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">LUXE ACCESSORIES</h3>
            <p className="text-background/70 text-sm leading-relaxed max-w-md">
              Premium men's accessories crafted with stainless steel. Bold designs for those who want to stand out effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-background/70 hover:text-background transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/?filter=featured" className="text-background/70 hover:text-background transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/?filter=new" className="text-background/70 hover:text-background transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/page/about-us" className="text-background/70 hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/page/contact" className="text-background/70 hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/page/returns" className="text-background/70 hover:text-background transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/page/privacy" className="text-background/70 hover:text-background transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/page/terms" className="text-background/70 hover:text-background transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold mb-1">Subscribe to our emails</h4>
              <p className="text-background/70 text-sm">Get updates on new arrivals and exclusive offers.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <Input 
                type="email" 
                placeholder="Email" 
                className="bg-transparent border-background/30 text-background placeholder:text-background/50 w-full md:w-64"
              />
              <Button variant="outline" className="border-background text-background hover:bg-background hover:text-foreground shrink-0">
                →
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © 2026, LUXE ACCESSORIES. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-background/70 hover:text-background transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="mailto:support@luxeaccessories.com" className="text-background/70 hover:text-background transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
