import React, { useState } from "react";
import PublicHeader from "./components/PublicHeader";
import PublicFooter from "./components/PublicFooter";
import HeroBanner from "./components/HeroBanner";
import FeatureCards from "./components/FeatureCards";
import CategoryGrid from "./components/CategoryGrid";
import ProductCarousel from "./components/ProductCarousel";
import PromoBanner from "./components/PromoBanner";
import "./PublicIndex.css";

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

const PublicIndex = () => {
  const [language, setLanguage] = useState('fr');

  const texts = {
    fr: {
      heroTitle: "Vêtements et accessoires pour hommes et femmes",
      heroSubtitle: "Découvrez notre sélection de styles premium. Jusqu'à 25% de réduction sur une sélection d'articles.",
      heroCta: "Découvrir",
      giftingTitle: "Idées Cadeaux",
      categoryTitle: "Acheter par Catégorie",
      trendingTitle: "Sneakers les Plus Recherchées",
      trendingNow: "Tendances du Moment",
      promoBanner: "Le Nouveau Casual",
      viewAll: "Voir tous les produits",
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
        "Jeans Baggy",
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
      heroTitle: "Clothing and accessories for men and women",
      heroSubtitle: "Discover our premium style selection. Up to 25% off on selected items.",
      heroCta: "Shop Now",
      giftingTitle: "Gifting Made Easy",
      categoryTitle: "Shop by Category",
      trendingTitle: "Most Wanted Sneakers",
      trendingNow: "Trending Now",
      promoBanner: "The New Casual",
      viewAll: "View all products",
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
        "Baggy Jeans",
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

  // Mélanger un tableau (Fisher-Yates)
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  // Récupérer les produits featured au montage
  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8080/api/router/products/featured");
        const products = await response.json();
        const shuffled = shuffle(products.map(p => ({ ...p, uniqueKey: `product-${p.id}` })));
        setTrendingProducts(shuffled);
      } catch (e) {
        setTrendingProducts([]);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader language={language} setLanguage={setLanguage} />
      
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
          showAllButton={true}
          showAllText={t.viewAll}
          onShowAll={() => window.location.href = '/products'}
        />

        {/* NO Popular Brands section on Public page */}

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

      <PublicFooter language={language} />
    </div>
  );
};

export default PublicIndex;
