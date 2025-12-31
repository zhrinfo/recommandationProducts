import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HommeHeader from "../homme/components/HommeHeader";
import HommeFooter from "../homme/components/HommeFooter";
import "./allproductF.css";

const AllProductsF = () => {
  const [language, setLanguage] = useState('fr');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewMode, setViewMode] = useState('grid');

  const texts = {
    fr: {
      pageTitle: "Tous les Produits",
      pageSubtitle: "Découvrez notre collection complète",
      filterBy: "Filtrer par",
      sortBy: "Trier par",
      allCategories: "Toutes les catégories",
      priceRange: "Gamme de prix",
      default: "Par défaut",
      priceLowHigh: "Prix: croissant",
      priceHighLow: "Prix: décroissant",
      newest: "Nouveautés",
      addToCart: "Ajouter au panier",
      viewDetails: "Voir détails",
      noProducts: "Aucun produit trouvé",
      loading: "Chargement...",
      products: "produits",
      quickView: "Aperçu rapide",
      newBadge: "Nouveau",
      saleBadge: "Solde"
    },
    en: {
      pageTitle: "All Products",
      pageSubtitle: "Discover our complete collection",
      filterBy: "Filter by",
      sortBy: "Sort by",
      allCategories: "All categories",
      priceRange: "Price range",
      default: "Default",
      priceLowHigh: "Price: Low to High",
      priceHighLow: "Price: High to Low",
      newest: "Newest",
      addToCart: "Add to Cart",
      viewDetails: "View Details",
      noProducts: "No products found",
      loading: "Loading...",
      products: "products",
      quickView: "Quick View",
      newBadge: "New",
      saleBadge: "Sale"
    }
  };

  const t = texts[language];

  const categories = [
    { id: 'all', name: language === 'fr' ? 'Toutes' : 'All' },
    { id: 'robes', name: language === 'fr' ? 'Robes' : 'Dresses' },
    { id: 'tops', name: 'Tops' },
    { id: 'pantalons', name: language === 'fr' ? 'Pantalons' : 'Pants' },
    { id: 'jupes', name: language === 'fr' ? 'Jupes' : 'Skirts' },
    { id: 'manteaux', name: language === 'fr' ? 'Manteaux' : 'Coats' },
    { id: 'chaussures', name: language === 'fr' ? 'Chaussures' : 'Shoes' },
    { id: 'accessoires', name: language === 'fr' ? 'Accessoires' : 'Accessories' },
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8082/api/products")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((p) => ({
          ...p,
          image: p.imageUrl,
          isNew: Math.random() > 0.7,
          onSale: Math.random() > 0.8,
          discount: Math.floor(Math.random() * 30) + 10,
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortBy) {
        case 'priceLowHigh': return a.price - b.price;
        case 'priceHighLow': return b.price - a.price;
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen femme-products-page bg-background">
      <HommeHeader language={language} setLanguage={setLanguage} />
      
      <main className="products-main">
        {/* Hero Section */}
        <section className="products-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">{t.pageTitle}</h1>
            <p className="hero-subtitle">{t.pageSubtitle}</p>
            <div className="hero-breadcrumb">
              <Link to="/femme">Home</Link>
              <span className="separator">/</span>
              <span className="current">{t.pageTitle}</span>
            </div>
          </div>
        </section>

        {/* Filters & Products Section */}
        <section className="products-section">
          <div className="products-container">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar">
              <div className="filter-group">
                <h3 className="filter-title">{t.filterBy}</h3>
                <div className="category-filters">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h3 className="filter-title">{t.priceRange}</h3>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    placeholder="Min"
                    className="price-input"
                  />
                  <span className="price-separator">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    placeholder="Max"
                    className="price-input"
                  />
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="products-content">
              {/* Toolbar */}
              <div className="products-toolbar">
                <div className="products-count">
                  <span className="count-number">{filteredProducts.length}</span> {t.products}
                </div>
                
                <div className="toolbar-actions">
                  <div className="sort-dropdown">
                    <label>{t.sortBy}:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="default">{t.default}</option>
                      <option value="priceLowHigh">{t.priceLowHigh}</option>
                      <option value="priceHighLow">{t.priceHighLow}</option>
                      <option value="newest">{t.newest}</option>
                    </select>
                  </div>

                  <div className="view-toggle">
                    <button 
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </button>
                    <button 
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>{t.loading}</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredProducts.length === 0 && (
                <div className="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <p>{t.noProducts}</p>
                </div>
              )}

              {/* Products Grid */}
              {!loading && filteredProducts.length > 0 && (
                <div className={`products-grid ${viewMode}`}>
                  {filteredProducts.map((product) => (
                    <article key={product.id} className="product-card">
                      <div className="product-image-wrapper">
                        <img 
                          src={product.image || 'https://via.placeholder.com/400x500'} 
                          alt={product.name}
                          className="product-image"
                        />
                        
                        {/* Badges */}
                        <div className="product-badges">
                          {product.isNew && <span className="badge new">{t.newBadge}</span>}
                          {product.onSale && <span className="badge sale">-{product.discount}%</span>}
                        </div>

                        {/* Quick Actions */}
                        <div className="product-actions">
                          <button className="action-btn wishlist" title="Wishlist">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                            </svg>
                          </button>
                          <button className="action-btn quick-view" title={t.quickView}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button className="add-to-cart-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="8" cy="21" r="1"></circle>
                            <circle cx="19" cy="21" r="1"></circle>
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                          </svg>
                          {t.addToCart}
                        </button>
                      </div>

                      <div className="product-info">
                        <span className="product-category">{product.category || 'Fashion'}</span>
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-price">
                          {product.onSale ? (
                            <>
                              <span className="original-price">${product.price?.toFixed(2)}</span>
                              <span className="sale-price">
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="current-price">${product.price?.toFixed(2)}</span>
                          )}
                        </div>
                        
                        {/* Color Options */}
                        <div className="product-colors">
                          <span className="color-dot" style={{ backgroundColor: '#1a1a1a' }}></span>
                          <span className="color-dot" style={{ backgroundColor: '#8b4513' }}></span>
                          <span className="color-dot" style={{ backgroundColor: '#f5f5dc' }}></span>
                          <span className="color-dot" style={{ backgroundColor: '#c41e3a' }}></span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <HommeFooter language={language} />
    </div>
  );
};

export default AllProductsF;