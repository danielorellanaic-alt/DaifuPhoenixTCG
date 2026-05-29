import {
  Flame,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import storeConfig from "../data/storeConfig";
import storeLogo from "../assets/logo/store-logo.png";

export default function Hero() {
  return (
    <section className="hero-store" id="inicio">
      <div className="banner">
        <img
          src={storeConfig.branding.bannerImage}
          alt="Banner tienda"
        />
      </div>

      <div className="store-profile">
        <img
          className="store-logo"
          src={storeLogo}
          alt={storeConfig.store.name}
        />

        <div className="store-info">
          <h2>{storeConfig.store.name}</h2>

          <div className="store-meta">
            <p>
              <Flame size={16} />
              {storeConfig.home.metaLines[0]}
            </p>

            <p>
              <MapPin size={16} />
              {storeConfig.home.metaLines[1]}
            </p>

            <p>
              <ShoppingBag size={16} />
              {storeConfig.home.metaLines[2]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}