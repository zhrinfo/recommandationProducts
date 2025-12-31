import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Promo Banner */}
      <div className="promo-banner">
        Free shipping on orders over $50 • Use code: WINTER25
      </div>
      
      {/* Main Header */}
      <div className="container flex items-center justify-between h-14 md:h-16">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Logo */}
        <a href="/" className="font-display text-2xl md:text-3xl font-bold tracking-tighter">
          MODO
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="nav-link text-muted-foreground hover:text-foreground">Women</a>
          <a href="#" className="nav-link font-bold border-b-2 border-foreground pb-1">Men</a>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for items and brands"
              className="pl-10 bg-secondary border-none rounded-full h-10"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Button>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="border-t border-border overflow-x-auto scrollbar-hide">
        <div className="container flex items-center gap-6 h-12 whitespace-nowrap">
          <a href="#" className="nav-link text-sm">New In</a>
          <a href="#" className="nav-link text-sm">Clothing</a>
          <a href="#" className="nav-link text-sm">Shoes</a>
          <a href="#" className="nav-link text-sm">Accessories</a>
          <a href="#" className="nav-link text-sm">Brands</a>
          <a href="#" className="nav-link text-sm">Sportswear</a>
          <a href="#" className="sale-badge">Sale</a>
        </div>
      </nav>

      {/* Mobile Search - Expandable */}
      {isSearchOpen && (
        <div className="md:hidden p-4 border-t border-border animate-fade-in">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for items and brands"
              className="pl-10 bg-secondary border-none rounded-full"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[calc(var(--header-height)+var(--nav-height))] bg-background z-40 animate-slide-in">
          <nav className="flex flex-col p-6 gap-4">
            <a href="#" className="text-lg font-medium py-2 border-b border-border">Women</a>
            <a href="#" className="text-lg font-bold py-2 border-b border-border">Men</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">New In</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">Clothing</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">Shoes</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">Accessories</a>
            <a href="#" className="text-lg font-medium py-2 text-sale">Sale</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
