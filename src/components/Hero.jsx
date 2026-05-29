import storeBanner from "../assets/logo/store-banner.png";

export default function Hero() {
  return (
    <section className="hero-store" id="inicio">
      <div className="banner">
        <img src={storeBanner} alt="Banner tienda" />
      </div>
    </section>
  );
}