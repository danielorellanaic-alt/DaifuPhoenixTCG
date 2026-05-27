import storeConfig from "../data/storeConfig";

export default function Hero() {
  return (
    <section className="hero-store" id="inicio">
      <div className="banner">
        <img src={storeConfig.branding.bannerImage} alt="Banner tienda" />
      </div>

      <div className="store-profile">
        <img
          className="store-logo"
          src={storeConfig.branding.logoImage}
          alt={storeConfig.store.name}
        />

        <div className="store-info">
          <h2>{storeConfig.store.name}</h2>

          <div className="store-meta">
            {storeConfig.home.metaLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}