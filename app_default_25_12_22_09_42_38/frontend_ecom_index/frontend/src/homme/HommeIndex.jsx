import { useState, useEffect } from "react";
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
      ]
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
      ]
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

  useEffect(() => {
    fetch("http://localhost:8081/api/products")
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
  }, []);

  const popularBrands = [
    { id: "1", name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { id: "2", name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { id: "3", name: "New Balance", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg" },
    { id: "4", name: "Puma", logo: "https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg" },
    { id: "5", name: "Converse", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg" },
    { id: "6", name: "Vans", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Vans-logo.svg" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HommeHeader language={language} setLanguage={setLanguage} />
      
      <main>
        {/* Hero Banner */}
        <HeroBanner
          image={heroWinter}
          title={t.heroTitle}
          subtitle={t.heroSubtitle}
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
        />

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
