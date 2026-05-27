import { Menu, Search, ShoppingCart, X } from "lucide-react";
import storeConfig from "../data/storeConfig";

export default function Header({
  setIsMenuOpen,
  searchOpen,
  setSearchOpen,
  search,
  setSearch,
  setIsCartOpen,
  cartCount,
}) {
  return (
    <header className="header-area">
      <div className="topbar">
        <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
          <Menu size={28} />
        </button>

        <h1>{storeConfig.store.name}</h1>

        <div className="topbar-actions">
          <button onClick={() => setSearchOpen(!searchOpen)}>
            {searchOpen ? <X size={22} /> : <Search size={22} />}
          </button>

          <button className="cart-icon-button" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={22} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="fixed-search">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar carta, producto o expansión..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      )}
    </header>
  );
}