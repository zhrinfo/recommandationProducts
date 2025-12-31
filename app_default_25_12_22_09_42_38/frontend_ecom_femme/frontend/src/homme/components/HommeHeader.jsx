import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, LogOut } from "lucide-react";

const HommeHeader = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

 const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('gender');
    window.location.href = 'http://localhost:8085/';
  };


  const texts = {
    fr: {
      search: "Rechercher des articles et marques",
      promo: "Livraison gratuite dès 50€ • Code: HIVER25",
      newIn: "Nouveautés",
      clothing: "Vêtements",
      shoes: "Chaussures",
      accessories: "Accessoires",
      brands: "Marques",
      sportswear: "Sportswear",
      sale: "Soldes",
      logout: "Déconnexion"
    },
    en: {
      search: "Search for items and brands",
      promo: "Free shipping on orders over €50 • Use code: WINTER25",
      newIn: "New In",
      clothing: "Clothing",
      shoes: "Shoes",
      accessories: "Accessories",
      brands: "Brands",
      sportswear: "Sportswear",
      sale: "Sale",
      logout: "Logout"
    }
  };

  const t = texts[language];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Promo Banner */}
      <div className="promo-banner">
        {t.promo}
      </div>
      
      {/* Main Header */}
      <div className="container flex items-center justify-between h-14 md:h-16">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 hover:opacity-70 transition-opacity"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo */}
        <a href="/homme" className="font-display text-2xl md:text-3xl font-bold tracking-tighter">
          NEXUS
        </a>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder={t.search}
              className="w-full pl-10 pr-4 py-2 bg-secondary border-none rounded-full text-sm"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <div className="language-switch hidden md:flex">
            <button 
              className={language === 'fr' ? 'active' : ''}
              onClick={() => setLanguage('fr')}
            >
              FR
            </button>
            <span>|</span>
            <button 
              className={language === 'en' ? 'active' : ''}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          {/* Search - Mobile */}
          <button 
            className="md:hidden p-2 hover:opacity-70 transition-opacity"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Cart */}
          <button className="p-2 hover:opacity-70 transition-opacity relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </button>

          {/* Logout Button */}
          <button 
            className="hidden md:flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {t.logout}
          </button>
        </div>
      </div>

      {/* Category Nav */}
      <nav className="border-t border-border overflow-x-auto scrollbar-hide">
        <div className="container flex items-center gap-6 h-12 whitespace-nowrap">
          <a href="#" className="nav-link text-sm">{t.newIn}</a>
          <a href="#" className="nav-link text-sm">{t.clothing}</a>
          <a href="#" className="nav-link text-sm">{t.shoes}</a>
          <a href="#" className="nav-link text-sm">{t.accessories}</a>
          <a href="#" className="nav-link text-sm">{t.brands}</a>
          <a href="#" className="nav-link text-sm">{t.sportswear}</a>
          <a href="#" className="sale-badge">{t.sale}</a>
        </div>
      </nav>

      {/* Mobile Search - Expandable */}
      {isSearchOpen && (
        <div className="md:hidden p-4 border-t border-border animate-fade-in">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder={t.search}
              className="w-full pl-10 pr-4 py-2 bg-secondary border-none rounded-full text-sm"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[160px] bg-background z-40 animate-slide-in">
          <nav className="flex flex-col p-6 gap-4">
            <a href="#" className="text-lg font-medium py-2 border-b border-border">{t.newIn}</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">{t.clothing}</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">{t.shoes}</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">{t.accessories}</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">{t.brands}</a>
            <a href="#" className="text-lg font-medium py-2 border-b border-border">{t.sportswear}</a>
            <a href="#" className="text-lg font-medium py-2 text-sale">{t.sale}</a>
            
            {/* Logout Button Mobile */}
            <button 
              className="flex items-center gap-2 w-full px-4 py-3 mt-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium justify-center"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {t.logout}
            </button>

            <div className="pt-4 border-t border-border">
              <div className="language-switch">
                <button 
                  className={language === 'fr' ? 'active' : ''}
                  onClick={() => setLanguage('fr')}
                >
                  FR
                </button>
                <span>|</span>
                <button 
                  className={language === 'en' ? 'active' : ''}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HommeHeader;
