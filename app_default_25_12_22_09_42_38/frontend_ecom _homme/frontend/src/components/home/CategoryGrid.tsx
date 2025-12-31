interface Category {
  id: string;
  name: string;
  image: string;
  link?: string;
}

interface CategoryGridProps {
  title?: string;
  categories: Category[];
  columns?: 2 | 3 | 4 | 6;
}

const CategoryGrid = ({ title, categories, columns = 3 }: CategoryGridProps) => {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    6: "grid-cols-3 md:grid-cols-6",
  };

  return (
    <section className="container py-8 md:py-12">
      {title && (
        <h2 className="font-display text-xl md:text-2xl text-center mb-8 uppercase tracking-wide">
          {title}
        </h2>
      )}
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {categories.map((category) => (
          <a 
            key={category.id}
            href={category.link || "#"}
            className="category-card aspect-[3/4]"
          >
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="category-card-overlay" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-background font-bold text-sm md:text-base uppercase tracking-wide">
                {category.name}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
