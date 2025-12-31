const FeatureCards = ({ title, features }) => {
  return (
    <section className="container py-8 md:py-12">
      {title && (
        <h2 className="font-display text-xl md:text-2xl text-center mb-8 uppercase tracking-wide">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {features.map((feature) => (
          <a 
            key={feature.id}
            href={feature.link || "#"}
            className="group"
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-3">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="text-center text-xs md:text-sm font-medium uppercase tracking-wide group-hover:underline">
              {feature.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
