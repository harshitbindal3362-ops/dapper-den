import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-foreground text-background text-center py-2 text-xs sm:text-sm font-medium">
        FREE SHIPPING ON ORDERS ABOVE ₹199 →
      </div>

      {/* Main header */}
      <header className="header-sticky">
        <div className="container-narrow">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="sm:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <Link 
                      to="/" 
                      className="text-xl font-bold tracking-tight"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      LUXE ACCESSORIES
                    </Link>
                  </div>
                  <nav className="flex-1 p-4 space-y-4">
                    <Link 
                      to="/" 
                      className="block py-2 text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Shop All
                    </Link>
                    <Link 
                      to="/?filter=featured" 
                      className="block py-2 text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Featured
                    </Link>
                    <Link 
                      to="/?filter=new" 
                      className="block py-2 text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      New Arrivals
                    </Link>
                  </nav>
                  <div className="p-4 border-t space-y-2">
                    {user ? (
                      <>
                        <Link 
                          to="/account" 
                          className="block py-2 text-lg font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            className="block py-2 text-lg font-medium text-sale"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                      </>
                    ) : (
                      <Link 
                        to="/auth" 
                        className="block py-2 text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login / Sign Up
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="text-lg sm:text-xl font-bold tracking-tight">
              LUXE ACCESSORIES
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:opacity-70 transition-opacity">
                Shop All
              </Link>
              <Link to="/?filter=featured" className="text-sm font-medium hover:opacity-70 transition-opacity">
                Featured
              </Link>
              <Link to="/?filter=new" className="text-sm font-medium hover:opacity-70 transition-opacity">
                New Arrivals
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-32 sm:w-48 h-9"
                    autoFocus
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}

              {/* User */}
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9"
                onClick={() => navigate(user ? '/account' : '/auth')}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 relative"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[88px] sm:h-[96px]" />
    </>
  );
}
