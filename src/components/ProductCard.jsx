import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, addToCart }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const categoryClass = {
    Singles: "single-card",
    Sellado: "sealed-card",
    Accesorios: "accessory-card",
  };

  return (
    <article className={`product-card ${categoryClass[product.category] || ""}`}>
      <div className="image-wrapper">
        {!imageLoaded && <div className="image-skeleton" />}

        <img
          className={imageLoaded ? "product-image loaded" : "product-image"}
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="product-info">
        <span className="product-game">{product.game}</span>

        <div className="product-top-row">
          <h3>
            {product.name}

            {product.cardNumber && (
              <span className="card-number">
                {" "}
                {product.cardNumber}
              </span>
            )}
          </h3>

          <span className="stock-text">Stock: {product.stock}</span>
        </div>

        {product.set && <p className="product-set">{product.set}</p>}

        <div className="product-tags">
          {product.category && <span>{product.category}</span>}
          {product.condition && <span>{product.condition}</span>}
          {product.language && <span>{product.language}</span>}
        </div>

        {product.rarity && <p className="rarity">{product.rarity}</p>}

        <div className="product-footer">
          <strong>${product.price.toLocaleString("es-CL")} CLP</strong>

          <button
            className="quick-cart-button"
            onClick={() => addToCart(product)}
            aria-label="Agregar al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}