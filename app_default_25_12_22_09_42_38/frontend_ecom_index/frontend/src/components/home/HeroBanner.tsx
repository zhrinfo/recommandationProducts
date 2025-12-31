interface HeroBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink?: string;
  promoCode?: string;
}

const HeroBanner = ({ image, title, subtitle, ctaText, promoCode }: HeroBannerProps) => {
  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16">
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-background mb-2 md:mb-4 max-w-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-background/90 text-sm md:text-lg mb-4 max-w-md">
            {subtitle}
          </p>
        )}
        {promoCode && (
          <div className="bg-background text-foreground px-4 py-2 mb-4 text-sm font-bold tracking-wider">
            Use code: {promoCode}
          </div>
        )}
        <button className="bg-background text-foreground px-8 py-3 text-sm font-bold uppercase tracking-wide hover:bg-background/90 transition-colors">
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
