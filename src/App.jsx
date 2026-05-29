import { useEffect, useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import SideMenu from "./components/SideMenu";
import ProductGrid from "./components/ProductGrid";
import FeaturedProducts from "./components/FeaturedProducts";
import CartDrawer from "./components/CartDrawer";
import StoreInfo from "./components/StoreInfo";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

import defaultProducts from "./data/products";

import { supabase } from "./lib/supabase";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [orders, setOrders] = useState([]);

  const [isAdminRoute, setIsAdminRoute] = useState(
    window.location.hash === "#admin"
  );

  const [isAdminLogged, setIsAdminLogged] = useState(false);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("SUPABASE ERROR:", error);

      setProducts(defaultProducts);
    } else {
      const formattedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        game: product.game,
        category: product.category,
        set: product.set_name,
        condition: product.condition,
        language: product.language,
        rarity: product.rarity,
        price: product.price,
        stock: product.stock,
        image: product.image,
        featured: product.featured,

        card_number: product.card_number
      }));

      setProducts(formattedProducts);
    }

    setLoadingProducts(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === "#admin");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const saveProducts = (newProducts) => {
    setProducts(newProducts);
  };

  const saveOrder = async (order) => {
    const { data: createdOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: String(order.id),
        status: "Pendiente",
        total: order.total,
      })
      .select()
      .single();

    if (orderError) {
      console.log("ERROR CREANDO ORDEN:", orderError);
      return false;
    }

    const orderItems = order.items.map((item) => ({
      order_id: createdOrder.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.log("ERROR CREANDO ITEMS:", itemsError);
      return false;
    }

    const formattedOrder = {
      id: order.id,
      status: "Pendiente",
      date: new Date(createdOrder.created_at).toLocaleString("es-CL"),
      items: order.items,
      total: order.total,
    };

    setOrders((currentOrders) => [
      formattedOrder,
      ...currentOrders,
    ]);

    return true;
  };

  if (isAdminRoute && !isAdminLogged) {
    return (
      <AdminLogin
        onLogin={() => setIsAdminLogged(true)}
      />
    );
  }

  if (isAdminRoute && isAdminLogged) {
    return (
      <AdminPanel
        products={products}
        setProducts={saveProducts}
        orders={orders}
        setOrders={setOrders}
      />
    );
  }

  const addToCart = (product) => {
    setCart((currentCart) => {
      const productAlreadyInCart =
        currentCart.find(
          (item) => item.id === product.id
        );

      if (productAlreadyInCart) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock
                ),
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.stock
              ),
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const publicProducts = products.filter(
    (product) => Number(product.stock) > 0
  );

  const filteredProducts =
    publicProducts.filter((product) => {
      const productName =
        product.name || "";

      const productSet =
        product.set || "";

      return (
        productName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        productSet
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });

  const yugiohProducts =
    filteredProducts.filter(
      (product) =>
        product.game === "Yu-Gi-Oh!"
    );

  const pokemonProducts =
    filteredProducts.filter(
      (product) =>
        product.game === "Pokémon"
    );

  const onePieceProducts =
    filteredProducts.filter(
      (product) =>
        product.game === "One Piece"
    );

  const magicProducts =
    filteredProducts.filter(
      (product) =>
        product.game === "Magic"
    );

  const accessoryProducts =
    filteredProducts.filter(
      (product) =>
        product.game === "Accesorios"
    );

  const otherProducts =
    filteredProducts.filter(
      (product) =>
        product.game === "Otros"
    );

  const preorderProducts =
    filteredProducts.filter(
      (product) =>
        product.game === "Pre-ventas"
    );

  return (
    <div className="app-layout">
      <SideMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}

        yugiohProducts={yugiohProducts}
        pokemonProducts={pokemonProducts}
        onePieceProducts={onePieceProducts}
        magicProducts={magicProducts}
        accessoryProducts={accessoryProducts}
        otherProducts={otherProducts}
        preorderProducts={preorderProducts}
      />

      <CartDrawer
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cart={cart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        saveOrder={saveOrder}
      />

      <div className="page-content">
        <Header
          setIsMenuOpen={setIsMenuOpen}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          search={search}
          setSearch={setSearch}
          setIsCartOpen={setIsCartOpen}
          cartCount={cartCount}
        />

        <Hero />

        <main className="main-content">  
          {loadingProducts && (
            <p className="empty-message">
              Cargando productos...
            </p>
          )}

          <FeaturedProducts
            products={filteredProducts}
            addToCart={addToCart}
          />

          {yugiohProducts.length > 0 && (
  <section className="section-block" id="yugioh">
    <div className="section-header">
      <div className="section-title">
        <h2>Yu-Gi-Oh!</h2>
      </div>
      <p>Productos y cartas de Yu-Gi-Oh!</p>
    </div>

    <ProductGrid products={yugiohProducts} addToCart={addToCart} />
  </section>
)}

{pokemonProducts.length > 0 && (
  <section className="section-block" id="pokemon">
    <div className="section-header">
      <div className="section-title">
        <h2>Pokémon</h2>
      </div>
      <p>Cartas y productos Pokémon</p>
    </div>

    <ProductGrid products={pokemonProducts} addToCart={addToCart} />
  </section>
)}

{onePieceProducts.length > 0 && (
  <section className="section-block" id="one-piece">
    <div className="section-header">
      <div className="section-title">
        <h2>One Piece</h2>
      </div>
      <p>Productos y cartas de One Piece</p>
    </div>

    <ProductGrid products={onePieceProducts} addToCart={addToCart} />
  </section>
)}

{magicProducts.length > 0 && (
  <section className="section-block" id="magic">
    <div className="section-header">
      <div className="section-title">
        <h2>Magic</h2>
      </div>
      <p>Productos y cartas de Magic The Gathering</p>
    </div>

    <ProductGrid products={magicProducts} addToCart={addToCart} />
  </section>
)}

{accessoryProducts.length > 0 && (
  <section className="section-block" id="accesorios">
    <div className="section-header">
      <div className="section-title">
        <h2>Accesorios</h2>
      </div>
      <p>Sleeves, deck box y accesorios</p>
    </div>

    <ProductGrid products={accessoryProducts} addToCart={addToCart} />
  </section>
)}

{otherProducts.length > 0 && (
  <section className="section-block" id="otros">
    <div className="section-header">
      <div className="section-title">
        <h2>Otros</h2>
      </div>
      <p>Productos variados</p>
    </div>

    <ProductGrid products={otherProducts} addToCart={addToCart} />
  </section>
)}

{preorderProducts.length > 0 && (
  <section className="section-block" id="preventas">
    <div className="section-header">
      <div className="section-title">
        <h2>Pre-ventas</h2>
      </div>
      <p>Reservas y próximos lanzamientos</p>
    </div>

    <ProductGrid products={preorderProducts} addToCart={addToCart} />
  </section>
)}

<StoreInfo />
        </main>
      </div>
    </div>
  );
}