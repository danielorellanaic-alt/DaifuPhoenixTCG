import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Plus,
  Package,
  Layers,
  Trash2,
  ShoppingCart,
  CheckCircle,
  XCircle,
} from "lucide-react";

const games = [
  "Pokémon",
  "Magic",
  "One Piece",
  "Yu-Gi-Oh!",
  "Accesorios",
  "Otros",
  "Pre-ventas",
];

const categories = ["Sellado", "Singles", "Accesorios"];

const conditions = [
  "",
  "Mint",
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
  "Damaged",
];

const rarities = [
  "",
  "Common",
  "Uncommon",
  "Rare",
  "Double Rare",
  "ACE SPEC",
  "Illustration Rare",
  "Ultra Rare",
  "Special Illustration Rare",
  "Hyper Rare",
  "Shiny Rare",
  "Shiny Ultra Rare",
  "Promo",
];

const PAGE_SIZE = 24;

const emptyForm = {
  name: "",
  game: "Pokémon",
  category: "Sellado",
  set: "",
  cardNumber: "",
  condition: "",
  language: "",
  rarity: "",
  price: "",
  stock: "",
  image: "",
  featured: false,
  league: false,
};

export default function AdminPanel({ products, setProducts, orders, setOrders }) {
  const [activeTab, setActiveTab] = useState("products");
  const [selectedGame, setSelectedGame] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [form, setForm] = useState(emptyForm);

  const [cardSearch, setCardSearch] = useState("");
  const [cardResults, setCardResults] = useState([]);
  const [searchingCards, setSearchingCards] = useState(false);
  const [cardPage, setCardPage] = useState(1);
  const [hasMoreCards, setHasMoreCards] = useState(false);

  const formatProduct = (product) => ({
    id: product.id,
    name: product.name,
    game: product.game,
    category: product.category,
    set: product.set_name,
    cardNumber: product.card_number,
    condition: product.condition,
    language: product.language,
    rarity: product.rarity,
    price: product.price,
    stock: product.stock,
    image: product.image,
    featured: product.featured,
    league: product.league,
  });

  const loadOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.log("ERROR CARGANDO ORDENES:", ordersError);
      return;
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("*");

    if (itemsError) {
      console.log("ERROR CARGANDO ITEMS:", itemsError);
      return;
    }

    setOrders(
      ordersData.map((order) => ({
        dbId: order.id,
        id: order.order_number,
        status: order.status,
        date: new Date(order.created_at).toLocaleString("es-CL"),
        total: order.total,
        items: itemsData
          .filter((item) => item.order_id === order.id)
          .map((item) => ({
            id: item.product_id,
            name: item.product_name,
            quantity: item.quantity,
            price: item.unit_price,
          })),
      }))
    );
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const searchPokemonCards = async (page = 1) => {
    if (!cardSearch.trim()) return;

    setSearchingCards(true);

    try {
      const response = await fetch(
        `/api/pokemon-cards?search=${encodeURIComponent(cardSearch)}&page=${page}`
      );

      const result = await response.json();
      const newResults = result.data || [];

      if (page === 1) {
        setCardResults(newResults);
      } else {
        setCardResults((current) => [...current, ...newResults]);
      }

      setCardPage(page);
      setHasMoreCards(newResults.length === PAGE_SIZE);
    } catch (error) {
      console.log("ERROR BUSCANDO CARTAS:", error);
      alert("No se pudieron buscar cartas.");
    } finally {
      setSearchingCards(false);
    }
  };

  const selectPokemonCard = (card) => {
    const totalCards = card.set?.printedTotal || card.set?.total || "";
    const cardNumber = totalCards
      ? `${card.number}/${totalCards}`
      : card.number;

    setForm((current) => ({
      ...current,
      name: card.name || current.name,
      game: "Pokémon",
      category: "Singles",
      set: card.set?.name || current.set,
      cardNumber,
      rarity: card.rarity || current.rarity,
      image: card.images?.large || card.images?.small || current.image,
    }));

    setCardResults([]);
    setCardSearch("");
    setCardPage(1);
    setHasMoreCards(false);
  };

  const addProduct = async (event) => {
    event.preventDefault();

    console.log("FORMULARIO:", form);

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: form.name,
        game: form.game,
        category: form.category,
        set_name: form.set,
        card_number: form.cardNumber || null,
        condition: form.condition || null,
        language: form.language,
        rarity: form.rarity || null,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image,
        featured: form.featured,
        league: form.league,
      })
      .select()
      .single();

    if (error) {
      console.log("ERROR AGREGANDO PRODUCTO:", error);
      alert("No se pudo agregar el producto");
      return;
    }

    setProducts([formatProduct(data), ...products]);
    setForm(emptyForm);
  };

  const updateStock = async (productId, newStock) => {
    const stockValue = Number(newStock);

    const { error } = await supabase
      .from("products")
      .update({ stock: stockValue })
      .eq("id", productId);

    if (error) {
      console.log("ERROR ACTUALIZANDO STOCK:", error);
      return;
    }

    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, stock: stockValue }
          : product
      )
    );
  };

  const deleteProduct = async (productId) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.log("ERROR ELIMINANDO PRODUCTO:", error);
      return;
    }

    setProducts(products.filter((product) => product.id !== productId));
  };

  const markOrderAsSold = async (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order || order.status !== "Pendiente") return;

    const { data, error } = await supabase
      .from("orders")
      .update({ status: "Vendida" })
      .eq("id", order.dbId)
      .eq("status", "Pendiente")
      .select()
      .single();

    if (error || !data) {
      console.log("ERROR ACTUALIZANDO ORDEN:", error);
      await loadOrders();
      return;
    }

    const updatedProducts = products.map((product) => {
      const orderItem = order.items.find((item) => item.id === product.id);

      if (!orderItem) return product;

      return {
        ...product,
        stock: Math.max(
          Number(product.stock) - Number(orderItem.quantity),
          0
        ),
      };
    });

    for (const product of updatedProducts) {
      await supabase
        .from("products")
        .update({ stock: product.stock })
        .eq("id", product.id);
    }

    setProducts(updatedProducts);
    await loadOrders();
  };

  const cancelOrder = async (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order || order.status !== "Pendiente") return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "Cancelada" })
      .eq("id", order.dbId)
      .eq("status", "Pendiente");

    if (error) {
      console.log("ERROR CANCELANDO ORDEN:", error);
      return;
    }

    await loadOrders();
  };

  const deleteOrderRecord = async (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order || order.status === "Pendiente") return;

    const confirmDelete = window.confirm(
      `¿Eliminar definitivamente la orden #${order.id}?`
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.dbId);

    if (error) {
      console.log("ERROR ELIMINANDO ORDEN:", error);
      return;
    }

    await loadOrders();
  };

  const filteredProducts = products.filter((product) => {
    const matchesGame =
      selectedGame === "Todos" || product.game === selectedGame;

    const matchesCategory =
      selectedCategory === "Todas" ||
      product.category === selectedCategory;

    return matchesGame && matchesCategory;
  });

  return (
    <main className="admin-panel">
      <div className="admin-header">
        <div>
          <span className="admin-badge">Dashboard</span>
          <h1>Panel de Administración</h1>
          <p>Gestiona productos, stock y órdenes.</p>
        </div>
      </div>

      <section className="admin-stats">
        <div className="admin-stat">
          <Package size={22} />

          <div>
            <strong>{products.length}</strong>
            <span>Productos</span>
          </div>
        </div>

        <div className="admin-stat">
          <Layers size={22} />

          <div>
            <strong>
              {products.reduce(
                (sum, item) => sum + Number(item.stock),
                0
              )}
            </strong>

            <span>Stock total</span>
          </div>
        </div>

        <div className="admin-stat">
          <ShoppingCart size={22} />

          <div>
            <strong>{orders.length}</strong>
            <span>Órdenes</span>
          </div>
        </div>
      </section>

      <div className="admin-tabs">
        <button
          type="button"
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Productos
        </button>

        <button
          type="button"
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => {
            setActiveTab("orders");
            loadOrders();
          }}
        >
          Órdenes
        </button>
      </div>

      {activeTab === "products" && (
        <div className="admin-layout">
          <form className="admin-form" onSubmit={addProduct}>
            <div className="admin-form-title">
              <Plus size={22} />
              <h2>Agregar producto</h2>
            </div>

            <div className="tcg-search-box">
              <input
                type="text"
                placeholder="Buscar carta Pokémon ej: Houndoom"
                value={cardSearch}
                onChange={(event) => setCardSearch(event.target.value)}
              />

              <button
                type="button"
                onClick={() => searchPokemonCards(1)}
                disabled={searchingCards}
              >
                {searchingCards ? "Buscando..." : "Buscar carta"}
              </button>
            </div>

            {cardResults.length > 0 && (
              <div className="tcg-results">
                {cardResults.map((card) => (
                  <button
                    type="button"
                    className="tcg-result-card"
                    key={card.id}
                    onClick={() => selectPokemonCard(card)}
                  >
                    <img src={card.images.small} alt={card.name} />

                    <div>
                      <strong>{card.name}</strong>
                      <span>{card.set.name}</span>
                      <small>
                        {card.number}/
                        {card.set.printedTotal || card.set.total} ·{" "}
                        {card.rarity || "Sin rareza"}
                      </small>
                    </div>
                  </button>
                ))}

                {hasMoreCards && (
                  <button
                    type="button"
                    className="load-more-cards"
                    onClick={() => searchPokemonCards(cardPage + 1)}
                    disabled={searchingCards}
                  >
                    {searchingCards
                      ? "Cargando..."
                      : "Cargar más resultados"}
                  </button>
                )}
              </div>
            )}

            <input
              name="name"
              placeholder="Nombre del producto"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="cardNumber"
              placeholder="Número de carta ej: 066/064"
              value={form.cardNumber}
              onChange={handleChange}
            />

            <div className="admin-form-grid">
              <select
                name="game"
                value={form.game}
                onChange={handleChange}
              >
                {games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-grid">
              <input
                name="set"
                placeholder="Expansión / Set"
                value={form.set}
                onChange={handleChange}
              />

              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
              >
                {conditions.map((condition) => (
                  <option key={condition || "none"} value={condition}>
                    {condition || "Sin estado"}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-grid">
              <input
                name="language"
                placeholder="Idioma"
                value={form.language}
                onChange={handleChange}
              />

              <select
                name="rarity"
                value={form.rarity}
                onChange={handleChange}
              >
                {rarities.map((rarity) => (
                  <option key={rarity || "none"} value={rarity}>
                    {rarity || "Sin rareza"}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-grid">
              <input
                name="price"
                type="number"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
                required
              />

              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </div>

            <input
              name="image"
              placeholder="URL de imagen"
              value={form.image}
              onChange={handleChange}
              required
            />

            <label className="admin-check" htmlFor="featured-check">
              <input
                id="featured-check"
                name="featured"
                type="checkbox"
                checked={form.featured}
                onChange={handleChange}
              />
              Marcar como destacado
            </label>

            <label className="admin-check" htmlFor="league-check">
              <input
                id="league-check"
                name="league"
                type="checkbox"
                checked={form.league}
                onChange={handleChange}
                />
                
                <span>De liga</span>
            </label>

            <button type="submit">Agregar producto</button>
          </form>

          <section className="admin-list">
            <div className="admin-list-header">
              <div>
                <h2>Inventario</h2>
                <p>Filtra y edita stock.</p>
              </div>

              <div className="admin-filters">
                <select
                  value={selectedGame}
                  onChange={(event) =>
                    setSelectedGame(event.target.value)
                  }
                >
                  <option>Todos</option>

                  {games.map((game) => (
                    <option key={game}>{game}</option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                >
                  <option>Todas</option>

                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-products">
              {filteredProducts.map((product) => (
                <div className="admin-product" key={product.id}>
                  <img src={product.image} alt={product.name} />

                  <div className="admin-product-info">
                    <h3>
                      {product.name}
                      {product.cardNumber
                        ? ` ${product.cardNumber}`
                        : ""}
                    </h3>

                    <p>
                      {product.game} · {product.category}
                    </p>

                    <strong>
                      ${product.price.toLocaleString("es-CL")}
                    </strong>
                  </div>

                  <div className="admin-stock">
                    <label>Stock</label>

                    <input
                      type="number"
                      value={product.stock}
                      onChange={(event) =>
                        updateStock(product.id, event.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="admin-delete"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === "orders" && (
        <section className="admin-orders">
          <div className="admin-list-header">
            <div>
              <h2>Órdenes</h2>
              <p>Confirma pagos y maneja pedidos.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="admin-empty">No hay órdenes registradas.</p>
          ) : (
            <div className="order-list">
              {orders.map((order) => (
                <article
                  className={
                    order.status === "Cancelada"
                      ? "order-card cancelled"
                      : "order-card"
                  }
                  key={order.id}
                >
                  <div className="order-header">
                    <div>
                      <h3>Orden #{order.id}</h3>
                      <p>{order.date}</p>
                    </div>

                    <span
                      className={
                        order.status === "Vendida"
                          ? "order-status sold"
                          : order.status === "Cancelada"
                          ? "order-status cancelled"
                          : "order-status pending"
                      }
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => (
                      <div
                        className="order-item"
                        key={`${order.id}-${item.id}`}
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>

                        <strong>
                          $
                          {(item.price * item.quantity).toLocaleString(
                            "es-CL"
                          )}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <span>Total</span>
                    <strong>
                      ${order.total.toLocaleString("es-CL")}
                    </strong>
                  </div>

                  <div className="order-actions">
                    {order.status === "Pendiente" && (
                      <>
                        <button
                          type="button"
                          className="sold-button"
                          onClick={() => markOrderAsSold(order.id)}
                        >
                          <CheckCircle size={18} />
                          Marcar como vendida
                        </button>

                        <button
                          type="button"
                          className="cancel-order-button"
                          onClick={() => cancelOrder(order.id)}
                        >
                          <XCircle size={18} />
                          Cancelar orden
                        </button>
                      </>
                    )}

                    {order.status !== "Pendiente" && (
                      <button
                        type="button"
                        className="delete-order-button"
                        onClick={() => deleteOrderRecord(order.id)}
                      >
                        <Trash2 size={18} />
                        Eliminar registro
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}