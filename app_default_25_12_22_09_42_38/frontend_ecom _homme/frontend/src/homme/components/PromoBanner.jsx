const PromoBanner = ({ image, title, ctaText, align = "center" }) => {
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <div className="relative w-full aspect-[21/9] overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className={`absolute inset-0 flex flex-col justify-center ${alignmentClasses[align]} p-8 md:p-16`}>
        <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-background mb-4 max-w-lg">
          {title}
        </h2>
        {ctaText && (
          <button className="bg-background text-foreground px-8 py-3 text-sm font-bold uppercase tracking-wide hover:bg-background/90 transition-colors">
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;
