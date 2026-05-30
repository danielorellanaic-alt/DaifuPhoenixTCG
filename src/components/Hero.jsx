import storeBanner from "../assets/logo/store-banner.png";

const marqueeItems = [
  "Pokémon TCG Competitivo & Coleccionismo",
  "Tienda online • Región de Valparaíso",
  "Singles • Sellado • Accesorios",
];

export default function Hero() {
  return (
    <section className="hero-store" id="inicio">
      <div className="banner">
        <img src={storeBanner} alt="Banner tienda" />
      </div>

      <div className="store-marquee">
        <div className="store-marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map(
            (item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            )
          )}
        </div>
      </div>
    </section>
  );
}