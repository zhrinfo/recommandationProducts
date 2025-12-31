import { useState, useEffect } from "react";
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

  const texts = {
    fr: {
      heroTitle: "Collection Femme Hiver 2024",
      heroSubtitle: "Découvrez les styles premium de la saison. Jusqu'à 25% de réduction.",
      heroCta: "Découvrir",
      giftingTitle: "Idées Cadeaux Femme",
      categoryTitle: "Acheter par Catégorie",
      trendingTitle: "Chaussures Tendances",
      brandsTitle: "Marques Populaires",
      trendingNow: "Tendances du Moment",
      promoBanner: "Le Nouveau Casual",
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
      brandsTitle: "Popular Brands",
      trendingNow: "Trending Now",
      promoBanner: "The New Casual",
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

  useEffect(() => {
    fetch("http://localhost:8082/api/products")
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
    <div className="min-h-screen femme-theme bg-background">
      <HommeHeader language={language} setLanguage={setLanguage} />
      <main>
        <HeroBanner image={heroWinter} title={t.heroTitle} subtitle={t.heroSubtitle} ctaText={t.heroCta} promoCode="HIVER25" />
        <FeatureCards title={t.giftingTitle} features={featuredCategories} />
        <section className="container"><PromoBanner image={promoCasual} title={t.promoBanner} ctaText={t.heroCta} align="left" /></section>
        <CategoryGrid title={t.categoryTitle} categories={shopByCategory} columns={6} />
        <ProductCarousel title={t.trendingTitle} products={trendingProducts} />
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
