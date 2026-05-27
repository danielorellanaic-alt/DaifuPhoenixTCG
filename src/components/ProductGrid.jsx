import ProductCard from "./ProductCard";

export default function ProductGrid({ products, addToCart }) {
  if (products.length === 0) {
    return <p className="empty-message">No hay productos para mostrar.</p>;
  }

  return (
    <section className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={addToCart}
        />
      ))}
    </section>
  );
}