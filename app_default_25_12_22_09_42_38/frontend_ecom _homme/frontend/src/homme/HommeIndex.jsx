import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HommeHeader from "./components/HommeHeader";
import HommeFooter from "./components/HommeFooter";
import HeroBanner from "./components/HeroBanner";
import FeatureCards from "./components/FeatureCards";
import CategoryGrid from "./components/CategoryGrid";
import ProductCarousel from "./components/ProductCarousel";
import PromoBanner from "./components/PromoBanner";
import BrandLogos from "./components/BrandLogos";
import "./HommeIndex.css";

// Import images
import heroWinter from "@/assets/hero-winter.jpg";
import categorySweaters from "@/assets/category-sweaters.jpg";
import categoryPants from "@/assets/category-pants.jpg";
import categoryCardigans from "@/assets/category-cardigans.jpg";
import categoryTees from "@/assets/category-tees.jpg";
import categoryOuterwear from "@/assets/category-outerwear.jpg";
import categorySneakers from "@/assets/category-sneakers.jpg";
import categoryShirts from "@/assets/category-shirts.jpg";
import promoCasual from "@/assets/promo-casual.jpg";
import productSneaker1 from "@/assets/product-sneaker-1.jpg";
import productSneaker2 from "@/assets/product-sneaker-2.jpg";
import productSneaker3 from "@/assets/product-sneaker-3.jpg";
import productSneaker4 from "@/assets/product-sneaker-4.jpg";
import productSneaker5 from "@/assets/product-sneaker-5.jpg";

const HommeIndex = () => {
  const [language, setLanguage] = useState('fr');
  const { username } = useParams();
  const navigate = useNavigate();

  const texts = {
    fr: {
      heroTitle: "Collection Homme Hiver 2024",
      heroSubtitle: "Découvrez les styles premium de la saison. Jusqu'à 25% de réduction sur une sélection d'articles.",
      heroCta: "Découvrir",
      giftingTitle: "Idées Cadeaux Homme",
      categoryTitle: "Acheter par Catégorie",
      trendingTitle: "Sneakers les Plus Recherchées",
      brandsTitle: "Marques Populaires",
      trendingNow: "Tendances du Moment",
      promoBanner: "Le Nouveau Casual",
      sweaters: "Pulls Henley",
      pants: "Pantalons & Jeans",
      cardigans: "Cardigans",
      tees: "T-Shirts Ajustés",
      outerwear: "Manteaux",
      sneakers: "Sneakers",
      shirts: "Chemises",
      coats: "Manteaux & Vestes",
      tshirts: "T-Shirts",
      shoes: "Chaussures",
      trendingLinks: [
        "Jeans Baggy Homme",
        "Sweats Oversize",
        "Vestes en Cuir",
        "Bottes d'Hiver",
        "Pantalons Cargo",
        "Manteaux en Laine",
        "T-Shirts Graphiques",
        "Costumes Slim"
      ],
      allProducts: "Tous les produits"
    },
    en: {
      heroTitle: "Men's Winter Collection 2024",
      heroSubtitle: "Discover premium styles for the season. Up to 25% off selected items.",
      heroCta: "Shop Now",
      giftingTitle: "Men's Gift Ideas",
      categoryTitle: "Shop by Category",
      trendingTitle: "Most Wanted Sneakers",
      brandsTitle: "Popular Brands",
      trendingNow: "Trending Now",
      promoBanner: "The New Casual",
      sweaters: "Henley Sweaters",
      pants: "Pants & Jeans",
      cardigans: "Cardigans",
      tees: "Perfect Fit Tees",
      outerwear: "Outerwear",
      sneakers: "Sneakers",
      shirts: "Shirts",
      coats: "Coats & Jackets",
      tshirts: "T-Shirts",
      shoes: "Shoes",
      trendingLinks: [
        "Men's Baggy Jeans",
        "Oversized Hoodies",
        "Leather Jackets",
        "Winter Boots",
        "Cargo Pants",
        "Wool Coats",
        "Graphic Tees",
        "Slim Fit Suits"
      ],
      allProducts: "All Products"
    }
  };

  const t = texts[language];

  const featuredCategories = [
    { id: "1", title: t.sweaters, image: categorySweaters },
    { id: "2", title: t.pants, image: categoryPants },
    { id: "3", title: t.cardigans, image: categoryCardigans },
    { id: "4", title: t.tees, image: categoryTees },
    { id: "5", title: t.outerwear, image: categoryOuterwear },
    { id: "6", title: t.sneakers, image: categorySneakers },
  ];

  const shopByCategory = [
    { id: "1", name: t.shirts, image: categoryShirts },
    { id: "2", name: t.coats, image: categoryOuterwear },
    { id: "3", name: t.tshirts, image: categoryTees },
    { id: "4", name: t.sweaters, image: categorySweaters },
    { id: "5", name: t.pants, image: categoryPants },
    { id: "6", name: t.shoes, image: categorySneakers },
  ];

  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchUrl = username 
      ? `http://localhost:8081/api/recommendations/homme/user/${username}`
      : "http://localhost:8081/api/products";
      
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        // Map API products to match ProductCarousel expected props
        const mapped = data.map((p) => ({
          ...p,
          image: p.imageUrl,
        }));
        setTrendingProducts(mapped);
      })
      .catch(() => setTrendingProducts([]));
  }, [username]);

  // Charger les recommandations personnalisées
  useEffect(() => {
    if (!username) return;
    
    const fetchRecommendations = async () => {
      try {
        console.log(`Fetching recommendations for user: ${username}`);
        const response = await fetch(`http://localhost:4001/api/recommendations/homme/${username}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Erreur ${response.status}: ${errorData.message || 'Erreur inconnue'}` 
          );
        }

        const responseData = await response.json();
        console.log('Réponse de l\'API des recommandations:', responseData);
        
        if (!responseData.recommendations || !Array.isArray(responseData.recommendations)) {
          console.error('Format de réponse inattendu. Tableau de recommandations attendu mais reçu:', responseData);
          setRecommendedProducts([]);
          return;
        }

        const processedProducts = responseData.recommendations.map((product) => ({
          ...product,
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image_url || 'https://via.placeholder.com/300x400?text=No+Image',
          recommendation_score: product.recommendation_score,
          recommendation_type: product.recommendation_type
        }));
        
        console.log('Produits recommandés traités:', processedProducts);
        setRecommendedProducts(processedProducts);
      } catch (error) {
        console.error('Erreur lors de la récupération des recommandations:', {
          error: error.message,
          name: error.name,
          stack: error.stack,
        });
        setRecommendedProducts([]);
      }
    };

    fetchRecommendations();
  }, [username]);

  const popularBrands = [
    { id: "1", name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { id: "2", name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { id: "3", name: "New Balance", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg" },
    { id: "4", name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg" },
    { id: "5", name: "Converse", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg" },
    { id: "6", name: "Vans", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Vans-logo.svg" },
  ];

  // Function to handle product click and send interaction
  const handleProductClick = (product) => {
    if (username && product?.id) {
      fetch("http://localhost:8081/api/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "VIEW",
          userId: username,
          productId: product.id,
          timestamp: new Date().toISOString(),
        }),
      });
    }
    navigate(`/homme/produit/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <HommeHeader language={language} setLanguage={setLanguage} />
      
      <main>
        {/* Hero Banner */}
        <HeroBanner
          image={heroWinter}
          title={username ? `Bienvenue , découvrez la Collection Homme Hiver 2026` : t.heroTitle}
          subtitle={username ? "Collection Femme Hiver 2024" : t.heroSubtitle}
          ctaText={t.heroCta}
          promoCode="HIVER25"
        />

        {/* Featured Categories */}
        <FeatureCards
          title={t.giftingTitle}
          features={featuredCategories}
        />

        {/* Promo Banner */}
        <section className="container">
          <PromoBanner
            image={promoCasual}
            title={t.promoBanner}
            ctaText={t.heroCta}
            align="left"
          />
        </section>

        {/* Shop by Category */}
        <CategoryGrid
          title={t.categoryTitle}
          categories={shopByCategory}
          columns={6}
        />

        {/* Trending Sneakers Carousel */}
        <ProductCarousel
          title={t.trendingTitle}
          products={trendingProducts}
          showAllButton={true}
          allButtonText={t.allProducts}
          onAllClick={() => navigate(`/homme/${username}/allproductH`)}
          onProductClick={handleProductClick}
        />

        {/* Recommended for You Section */}
        {recommendedProducts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                {language === 'fr' ? 'Recommandations pour vous' : 'Recommended for You'}
              </h2>
              <ProductCarousel
                products={recommendedProducts}
                onProductClick={handleProductClick}
              />
            </div>
          </section>
        )}

        {/* Popular Brands */}
        <BrandLogos
          title={t.brandsTitle}
          brands={popularBrands}
        />

        {/* Quick Links Section */}
        <section className="container py-8 md:py-12">
          <h2 className="font-display text-xl md:text-2xl text-center mb-8 uppercase tracking-wide">
            {t.trendingNow}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {t.trendingLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="px-4 py-2 border border-border text-sm hover:bg-secondary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </section>
      </main>

      <HommeFooter language={language} />
    </div>
  );
};

export default HommeIndex;
