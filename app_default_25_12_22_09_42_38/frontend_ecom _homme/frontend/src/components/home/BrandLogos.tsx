interface Brand {
  id: string;
  name: string;
  logo: string;
  link?: string;
}

interface BrandLogosProps {
  title?: string;
  brands: Brand[];
}

const BrandLogos = ({ title, brands }: BrandLogosProps) => {
  return (
    <section className="container py-8 md:py-12">
      {title && (
        <h2 className="font-display text-xl md:text-2xl text-center mb-8 uppercase tracking-wide">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <a 
            key={brand.id}
            href={brand.link || "#"}
            className="aspect-square bg-secondary flex items-center justify-center p-4 hover:shadow-md transition-shadow"
          >
            <img 
              src={brand.logo} 
              alt={brand.name}
              className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default BrandLogos;
