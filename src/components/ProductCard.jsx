import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import leagueIcon from "../assets/icons/league-icon.png";

export default function ProductCard({ product, addToCart }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const categoryClass = {
    Singles: "single-card",
    Sellado: "sealed-card",
    Accesorios: "accessory-card",
  };

  const hasCondition =
    product.condition &&
    product.condition !== "Sin estado";

  return (
    <article
      className={`product-card ${
        categoryClass[product.category] || ""
      }`}
    >
      <div className="image-wrapper">
        {!imageLoaded && (
          <div className="image-skeleton" />
        )}

        <img
          className={
            imageLoaded
              ? "product-image loaded"
              : "product-image"
          }
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
        />

        {product.league && (
          <img
            className="league-icon"
            src={leagueIcon}
            alt="Carta de liga"
          />
        )}
      </div>

      <div className="product-info">
        <span className="product-game">
          {product.game}
        </span>

        <div className="product-top-row">
          <h3>{product.name}</h3>

          <span className="stock-text">
            Stock: {product.stock}
          </span>
        </div>

        <div className="product-extra-info">
          {product.language && (
            <span>{product.language}</span>
          )}

          {product.card_number && (
            <span>#{product.card_number}</span>
          )}

          {hasCondition && (
            <span>{product.condition}</span>
          )}
        </div>

        {product.set && (
          <p className="product-set">
            {product.set}
          </p>
        )}

        {product.rarity && (
          <p className="rarity">
            {product.rarity}
          </p>
        )}

        <div className="product-footer">
          <strong>
            $
            {product.price.toLocaleString(
              "es-CL"
            )}{" "}
            CLP
          </strong>

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