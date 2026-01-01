import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import HommeHeader from "../homme/components/HommeHeader";
import HommeFooter from "../homme/components/HommeFooter";
import HeroBanner from "../homme/components/HeroBanner";
import FeatureCards from "../homme/components/FeatureCards";
import CategoryGrid from "../homme/components/CategoryGrid";
import ProductCarousel from "../homme/components/ProductCarousel";
import PromoBanner from "../homme/components/PromoBanner";
import BrandLogos from "../homme/components/BrandLogos";
import "./FemmeIndex.css";

import heroWinter from "@/assets/1.png";
import categorySweaters from "@/assets/category-sweaters.jpg";
import categoryPants from "@/assets/category-pants.jpg";
import categoryCardigans from "@/assets/category-cardigans.jpg";
import categoryTees from "@/assets/category-tees.jpg";
import categoryOuterwear from "@/assets/category-outerwear.jpg";
import categorySneakers from "@/assets/category-sneakers.jpg";
import categoryShirts from "@/assets/category-shirts.jpg";
import promoCasual from "@/assets/2.jpg";
import productSneaker1 from "@/assets/product-sneaker-1.jpg";
import productSneaker2 from "@/assets/product-sneaker-2.jpg";
import productSneaker3 from "@/assets/product-sneaker-3.jpg";
import productSneaker4 from "@/assets/product-sneaker-4.jpg";
import productSneaker5 from "@/assets/product-sneaker-5.jpg";

const FemmeIndex = () => {
  const [language, setLanguage] = useState('fr');
  const { username } = useParams();
  const navigate = useNavigate();


  const texts = {
    fr: {
      heroTitle: "Collection Femme Hiver 2024",
      heroSubtitle: "Découvrez les styles premium de la saison. Jusqu'à 25% de réduction.",
      heroCta: "Découvrir",
      giftingTitle: "Idées Cadeaux Femme",
      categoryTitle: "Acheter par Catégorie",
      trendingTitle: "Chaussures Tendances",
      recommendedTitle: "Recommandations pour vous",
      brandsTitle: "Marques Populaires",
      trendingNow: "Tendances du Moment",
      promoBanner: "Le Nouveau Casual",
      allProducts: "Tous les produits",
      sweaters: "Pulls",
      pants: "Pantalons",
      cardigans: "Cardigans",
      tees: "Tops",
      outerwear: "Manteaux",
      sneakers: "Chaussures",
      shirts: "Blouses",
      coats: "Vestes",
      tshirts: "T-Shirts",
      shoes: "Chaussures",
      trendingLinks: ["Robes", "Jupes", "Tops", "Pulls", "Manteaux", "Bottes", "Sacs", "Accessoires"]
    },
    en: {
      heroTitle: "Women's Winter Collection 2024",
      heroSubtitle: "Discover premium styles for the season. Up to 25% off.",
      heroCta: "Shop Now",
      giftingTitle: "Women's Gift Ideas",
      categoryTitle: "Shop by Category",
      trendingTitle: "Trending Shoes",
      recommendedTitle: "Recommended for You",
      brandsTitle: "Popular Brands",
      trendingNow: "Trending Now",
      promoBanner: "The New Casual",
      allProducts: "All Products",
      sweaters: "Sweaters",
      pants: "Pants",
      cardigans: "Cardigans",
      tees: "Tops",
      outerwear: "Outerwear",
      sneakers: "Shoes",
      shirts: "Blouses",
      coats: "Jackets",
      tshirts: "T-Shirts",
      shoes: "Shoes",
      trendingLinks: ["Dresses", "Skirts", "Tops", "Sweaters", "Coats", "Boots", "Bags", "Accessories"]
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

  // Charger les produits tendance
  useEffect(() => {
    const url = username 
      ? `http://localhost:8082/api/recommendations/femme/${username}`
      : 'http://localhost:8082/api/recommendations/femme';
      
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((p) => ({
          ...p,
          image: p.imageUrl,
        }));
        setTrendingProducts(mapped);
      })
      .catch((error) => {
        console.error('Error fetching trending products:', error);
        setTrendingProducts([]);
      });
  }, [username]);

  // Charger les recommandations personnalisées
  useEffect(() => {
    if (!username) return;
    
    const fetchRecommendations = async () => {
      try {
        console.log(`Fetching recommendations for user: ${username}`);
        const response = await fetch(`http://localhost:4000/api/recommendations/femme/${username}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Erreur ${response.status}: ${errorData.message || 'Erreur inconnue'}`
          );
        }

        const responseData = await response.json();
        console.log('Réponse de l\'API des recommandations:', responseData);
        
        // Vérifier si nous avons des recommandations
        if (!responseData.recommendations || !Array.isArray(responseData.recommendations)) {
          console.error('Format de réponse inattendu. Tableau de recommandations attendu mais reçu:', responseData);
          setRecommendedProducts([]);
          return;
        }

        // Traitement des produits recommandés
        const processedProducts = responseData.recommendations.map((product) => ({
          ...product,
          id: product.id.toString(), // S'assurer que l'ID est une chaîne
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image_url || 'https://via.placeholder.com/300x400?text=No+Image',
          // Conserver les autres propriétés utiles
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

  return (
    <div className="min-h-screen femme-theme bg-background">
      <HommeHeader language={language} setLanguage={setLanguage} />
      <main>
        <HeroBanner image={heroWinter} title={username ? `Bienvenue, découvrez la Collection Femme Hiver 2026` : t.heroTitle} subtitle={t.heroSubtitle} ctaText={t.heroCta} promoCode="HIVER25" />
        <FeatureCards title={t.giftingTitle} features={featuredCategories} />
        <section className="container"><PromoBanner image={promoCasual} title={t.promoBanner} ctaText={t.heroCta} align="left" /></section>
        <CategoryGrid title={t.categoryTitle} categories={shopByCategory} columns={6} />
        <ProductCarousel
          title={t.trendingTitle}
          products={trendingProducts}
          allProductsText={t.allProducts}
          allProductsLink={`/femme/${username}/products`}
          onProductClick={async (product) => {
            // Send interaction POST
            try {
              await fetch("http://localhost:8082/api/interactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "VIEW",
                  userId: username,
                  productId: product.id,
                  timestamp: new Date().toISOString(),
                }),
              });
            } catch (e) {
              // Optionally handle error
            }
            navigate(`/femme/produit/${product.id}`);
          }}
        />
        
        {/* Section Recommandations pour vous */}
        {username && (
          <ProductCarousel
            title={t.recommendedTitle}
            products={recommendedProducts}
            allProductsText={t.allProducts}
            allProductsLink={`/femme/${username}/products`}
            onProductClick={async (product) => {
              try {
                await fetch('http://localhost:4000/api/interactions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: username,
                    productId: product.id,
                    interactionType: 'view',
                    timestamp: new Date().toISOString()
                  })
                });
                navigate(`/femme/${username}/product/${product.id}`);
              } catch (error) {
                console.error('Error tracking interaction:', error);
                navigate(`/femme/${username}/product/${product.id}`);
              }
            }}
          />
        )}
        
        <BrandLogos title={t.brandsTitle} brands={popularBrands} />
        <section className="container py-8 md:py-12">
          <h2 className="font-display text-xl md:text-2xl text-center mb-8 uppercase tracking-wide">{t.trendingNow}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {t.trendingLinks.map((link) => (<a key={link} href="#" className="px-4 py-2 border border-border text-sm hover:bg-secondary transition-colors">{link}</a>))}
          </div>
        </section>
      </main>
      <HommeFooter language={language} />
    </div>
  );
};

export default FemmeIndex;
