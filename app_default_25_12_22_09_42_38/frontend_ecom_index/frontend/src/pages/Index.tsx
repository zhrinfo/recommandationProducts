import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import FeatureCards from "@/components/home/FeatureCards";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import PromoBanner from "@/components/home/PromoBanner";
import BrandLogos from "@/components/home/BrandLogos";

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

const Index = () => {
  const featuredCategories = [
    { id: "1", title: "Henley Sweaters", image: categorySweaters },
    { id: "2", title: "Pants & Jeans", image: categoryPants },
    { id: "3", title: "Cardigans", image: categoryCardigans },
    { id: "4", title: "Perfect Fit Tees", image: categoryTees },
    { id: "5", title: "Outerwear", image: categoryOuterwear },
    { id: "6", title: "Sneakers", image: categorySneakers },
  ];

  const shopByCategory = [
    { id: "1", name: "Shirts", image: categoryShirts },
    { id: "2", name: "Coats & Jackets", image: categoryOuterwear },
    { id: "3", name: "T-Shirts", image: categoryTees },
    { id: "4", name: "Sweaters", image: categorySweaters },
    { id: "5", name: "Pants", image: categoryPants },
    { id: "6", name: "Shoes", image: categorySneakers },
  ];

  const trendingProducts = [
    { id: "1", name: "Air Force 1 '07", brand: "Nike", price: 110, image: productSneaker1, isNew: true },
    { id: "2", name: "574 Core", brand: "New Balance", price: 79.99, originalPrice: 89.99, image: productSneaker2 },
    { id: "3", name: "Ultraboost Light", brand: "Adidas", price: 159.99, image: productSneaker3 },
    { id: "4", name: "Penny Loafer", brand: "ASOS Design", price: 65, originalPrice: 85, image: productSneaker4 },
    { id: "5", name: "Chuck Taylor All Star", brand: "Converse", price: 60, image: productSneaker5 },
    { id: "6", name: "Air Force 1 Low", brand: "Nike", price: 99.99, originalPrice: 120, image: productSneaker1 },
  ];

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
      <Header />
      
      <main>
        {/* Hero Banner */}
        <HeroBanner
          image={heroWinter}
          title="Winter Collection 2024"
          subtitle="Discover premium styles for the season. Up to 25% off selected items."
          ctaText="Shop Now"
          promoCode="WINTER25"
        />

        {/* Featured Categories */}
        <FeatureCards
          title="Gifting Made Easy"
          features={featuredCategories}
        />

        {/* Promo Banner */}
        <section className="container">
          <PromoBanner
            image={promoCasual}
            title="The New Casual"
            ctaText="Shop Now"
            align="left"
          />
        </section>

        {/* Shop by Category */}
        <CategoryGrid
          title="Shop by Category"
          categories={shopByCategory}
          columns={6}
        />

        {/* Trending Sneakers Carousel */}
        <ProductCarousel
          title="Most Wanted Sneakers"
          products={trendingProducts}
        />

        {/* Popular Brands */}
        <BrandLogos
          title="Popular Brands"
          brands={popularBrands}
        />

        {/* Quick Links Section */}
        <section className="container py-8 md:py-12">
          <h2 className="font-display text-xl md:text-2xl text-center mb-8 uppercase tracking-wide">
            Trending Now
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Men's Baggy Jeans",
              "Oversized Hoodies",
              "Leather Jackets",
              "Winter Boots",
              "Cargo Pants",
              "Wool Coats",
              "Graphic Tees",
              "Slim Fit Suits",
            ].map((link) => (
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

      <Footer />
    </div>
  );
};

export default Index;
