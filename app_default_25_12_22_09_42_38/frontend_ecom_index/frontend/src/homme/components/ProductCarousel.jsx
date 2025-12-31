import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRef, useState } from "react";

const ProductCarousel = ({ title, products }) => {
  const scrollRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl uppercase tracking-wide">
            {title}
          </h2>
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-2 border border-border rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-2 border border-border rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
      >
        {products.map((product) => (
          <div 
            key={product.id}
            className="product-card flex-shrink-0 w-[200px] md:w-[260px]"
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="product-card-image"
              />
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-foreground text-background text-xs px-2 py-1 font-bold">
                  NEW
                </span>
              )}
              {product.originalPrice && (
                <span className="absolute top-2 left-2 sale-badge">
                  SALE
                </span>
              )}
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
                {product.brand}
              </p>
              <h3 className="text-sm font-medium mt-1 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm font-bold ${product.originalPrice ? "text-sale" : ""}`}>
                  {product.price.toFixed(2)}€
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel;
