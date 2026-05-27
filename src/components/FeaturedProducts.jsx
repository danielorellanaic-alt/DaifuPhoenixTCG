import { Star } from "lucide-react";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({ products, addToCart }) {
  const featured = products.filter((product) => product.featured);

  if (featured.length === 0) return null;

  return (
    <section className="section-block" id="destacados">
      <div className="section-header">
        <div className="section-title">
          <Star size={24} />
          <h2>Destacados</h2>
        </div>

        <p>Lo más buscado por la comunidad</p>
      </div>

      <div className="featured-grid">
        {featured.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}