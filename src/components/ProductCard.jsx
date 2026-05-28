import { useState } from "react";

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

        <h3>{product.name}</h3>

        {product.set && <p className="product-set">{product.set}</p>}

        <div className="product-tags">
          {product.category && <span>{product.category}</span>}
          {product.condition && <span>{product.condition}</span>}
          {product.language && <span>{product.language}</span>}
        </div>

        {product.rarity && <p className="rarity">{product.rarity}</p>}

        <div className="product-footer">
          <strong>${product.price.toLocaleString("es-CL")} CLP</strong>
          <small>Stock: {product.stock}</small>
        </div>

        <button className="add-button" onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}