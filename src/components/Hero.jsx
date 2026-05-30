import storeBanner from "../assets/logo/store-banner.png";

export default function Hero() {
  return (
    <section className="hero-store" id="inicio">
      <div className="banner">
        <img
          src={storeBanner}
          alt="Banner tienda"
        />
      </div>

      <div className="store-marquee">
        <div className="store-marquee-track">
          <span>Pokémon TCG Competitivo & Coleccionismo</span>
          <span>Tienda online • Región de Valparaíso</span>
          <span>Singles • Sellado • Accesorios</span>

          <span>Pokémon TCG Competitivo & Coleccionismo</span>
          <span>Tienda online • Región de Valparaíso</span>
          <span>Singles • Sellado • Accesorios</span>
        </div>
      </div>
    </section>
  );
}