import {
  ShoppingBag,
  CreditCard,
  Truck,
  MapPin,
} from "lucide-react";

import storeConfig from "../data/storeConfig";

export default function StoreInfo() {
  return (
    <section className="store-info-section">
      <div className="info-card">
        <div className="info-title">
          <ShoppingBag size={22} />
          <h2>Cómo comprar</h2>
        </div>

        <div className="info-list">
          {storeConfig.shoppingInfo.howToBuy.map((step, index) => (
            <div className="info-item" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="info-card">
        <div className="info-title">
          <CreditCard size={22} />
          <h2>Métodos de pago</h2>
        </div>

        <ul>
          {storeConfig.shoppingInfo.paymentMethods.map((method) => (
            <li key={method}>{method}</li>
          ))}
        </ul>
      </div>

      <div className="info-card">
        <div className="info-title">
          <Truck size={22} />
          <h2>Métodos de entrega</h2>
        </div>

        <ul>
          {storeConfig.shoppingInfo.deliveryMethods.map((method) => (
            <li key={method}>{method}</li>
          ))}
        </ul>
      </div>

      <div className="info-card">
        <div className="info-title">
          <MapPin size={22} />
          <h2>Ubicación</h2>
        </div>

        <p>{storeConfig.store.location}</p>
      </div>
    </section>
  );
}