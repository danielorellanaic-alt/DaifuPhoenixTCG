import { useMemo } from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";

import storeConfig from "../data/storeConfig";

export default function CartDrawer({
  isOpen,
  setIsOpen,
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  saveOrder,
}) {
  const orderNumber = useMemo(() => {
    return Math.floor(10000 + Math.random() * 90000);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const createWhatsappMessage = () => {
    const productLines = cart
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - $${(
            item.price * item.quantity
          ).toLocaleString("es-CL")}`
      )
      .join("\n");

    return `Hola! Quiero hacer este pedido:

ORDEN #${orderNumber}

${productLines}

Total: $${total.toLocaleString("es-CL")}`;
  };

  const sendToWhatsapp = async () => {
    if (cart.length === 0) return;

    const order = {
      id: orderNumber,
      status: "Pendiente",
      date: new Date().toLocaleString("es-CL"),
      items: cart,
      total,
    };

    const orderSaved = await saveOrder(order);

    if (!orderSaved) {
      alert("No se pudo guardar la orden. Intenta nuevamente.");
      return;
    }

    const message = encodeURIComponent(createWhatsappMessage());

    const whatsappUrl = `https://wa.me/${storeConfig.store.whatsappNumber}?text=${message}`;

    window.location.href = whatsappUrl;
  };

  return (
    <>
      {isOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={isOpen ? "cart-drawer open" : "cart-drawer"}
      >
        <div className="cart-header">
          <div>
            <h2>Carrito</h2>

            <small>Orden #{orderNumber}</small>
          </div>

          <button onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="cart-empty">
            Tu carrito está vacío.
          </p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>

                    <p>
                      ${item.price.toLocaleString("es-CL")}
                    </p>

                    <div className="quantity-controls">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus size={16} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>

                <strong>
                  ${total.toLocaleString("es-CL")}
                </strong>
              </div>

              <button
                className="whatsapp-button"
                onClick={sendToWhatsapp}
              >
                Enviar pedido por WhatsApp
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}