import React, { useState, useEffect } from "react";
import PublicHeader from "./components/PublicHeader";
import PublicFooter from "./components/PublicFooter";
import { Heart } from "lucide-react";
import "./PublicIndex.css";

const AllProducts = () => {
  const [language, setLanguage] = useState('fr');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const texts = {
    fr: {
      title: "Tous les Produits",
      loading: "Chargement des produits...",
      error: "Erreur lors du chargement des produits",
      noProducts: "Aucun produit disponible",
      products: "produits"
    },
    en: {
      title: "All Products",
      loading: "Loading products...",
      error: "Error loading products",
      noProducts: "No products available",
      products: "products"
    }
  };

  const t = texts[language];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/router/products/all");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader language={language} setLanguage={setLanguage} />
      
      <main className="container py-8 md:py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-center">
            {t.title}
          </h1>
          {!loading && !error && (
            <p className="text-center text-muted-foreground mt-2">
              {products.length} {t.products}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            <span className="ml-4 text-muted-foreground">{t.loading}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">{t.error}</p>
            <p className="text-muted-foreground text-sm mt-2">{error}</p>
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t.noProducts}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <div 
                key={product.id}
                className="product-card group"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                    }}
                  />
                  <button
                    className={`absolute top-2 right-2 p-2 bg-background/80 hover:bg-background rounded-full transition-opacity ${
                      hoveredId === product.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="pt-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.category}
                  </p>
                  <h3 className="text-sm font-medium mt-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold">
                      {product.price.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <PublicFooter language={language} />
    </div>
  );
};

export default AllProducts;
