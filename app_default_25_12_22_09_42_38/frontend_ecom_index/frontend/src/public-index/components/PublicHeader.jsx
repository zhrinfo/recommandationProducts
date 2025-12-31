import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";


import { useNavigate } from "react-router-dom";

const PublicHeader = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Recherche de produits avec debounce
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/router/products/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Erreur de recherche:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);


  // État réactif pour savoir si l'utilisateur est connecté
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));

  // Met à jour l'état si le token change (login/logout dans d'autres onglets)
  useEffect(() => {
    const checkToken = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };


  const texts = {
    fr: {
      search: "Rechercher des articles et marques",
      login: "Se connecter",
      signup: "S'inscrire",
      logout: "Se déconnecter",
      promo: "Livraison gratuite dès 50€ • Code: HIVER25",
      noResults: "Aucun produit trouvé",
      searching: "Recherche en cours..."
    },
    en: {
      search: "Search for items and brands",
      login: "Log in",
      signup: "Sign up",
      logout: "Log out",
      promo: "Free shipping on orders over €50 • Use code: WINTER25",
      noResults: "No products found",
      searching: "Searching..."
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
        <a href="/" className="font-display text-2xl md:text-3xl font-bold tracking-tighter">
          NEXUS
        </a>

        {/* Language Switch + Auth Buttons */}
        <div className="flex items-center gap-4">
          {/* Language Switch */}
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

          {/* Search - Mobile */}
          <button 
            className="md:hidden p-2 hover:opacity-70 transition-opacity"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Auth Buttons */}
          <div className="auth-buttons hidden md:flex">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="auth-btn auth-btn-primary">{t.logout}</button>
            ) : (
              <>
                <a href="/login" className="auth-btn">{t.login}</a>
                <a href="/register" className="auth-btn auth-btn-primary">{t.signup}</a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar - Desktop */}
      <div className="hidden md:block border-t border-border">
        <div className="container py-3">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border-none rounded-full text-sm"
            />
            {/* Résultats de recherche - Desktop */}
            {searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    {t.searching}
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <a
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <p className="font-bold text-sm">{product.price.toFixed(2)}€</p>
                    </a>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    {t.noResults}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - Expandable */}
      {isSearchOpen && (
        <div className="md:hidden p-4 border-t border-border animate-fade-in">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border-none rounded-full text-sm"
              autoFocus
            />
            {/* Résultats de recherche - Mobile */}
            {searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    {t.searching}
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <a
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <p className="font-bold text-sm">{product.price.toFixed(2)}€</p>
                    </a>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    {t.noResults}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[120px] bg-background z-40 animate-slide-in">
          <nav className="flex flex-col p-6 gap-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-lg font-bold py-2 border-b border-border w-full text-left">{t.logout}</button>
            ) : (
              <>
                <a href="/login" className="text-lg font-medium py-2 border-b border-border">{t.login}</a>
                <a href="/register" className="text-lg font-bold py-2 border-b border-border">{t.signup}</a>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
