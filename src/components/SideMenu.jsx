import {
  Star,
  Sparkles,
  Shield,
  Swords,
  WandSparkles,
  BriefcaseBusiness,
  CircleEllipsis,
  Clock,
  MessageCircle,
} from "lucide-react";

import storeConfig from "../data/storeConfig";
import storeLogo from "../assets/logo/store-logo.png";

export default function SideMenu({
  isOpen,
  setIsOpen,

  yugiohProducts,
  pokemonProducts,
  onePieceProducts,
  magicProducts,
  accessoryProducts,
  otherProducts,
  preorderProducts,
}) {
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div
          className="menu-overlay"
          onClick={closeMenu}
        />
      )}

      <aside
        className={
          isOpen
            ? "side-menu open"
            : "side-menu"
        }
      >
        <div className="sidebar-brand">
          <img
            src={storeLogo}
            alt={storeConfig.store.name}
          />

          <h3>{storeConfig.store.name}</h3>
        </div>

        <nav className="side-menu-links">
          <small>Destacados</small>

          <a
            href="#destacados"
            onClick={closeMenu}
          >
            <Star size={18} />
            <span>Destacados</span>
          </a>

          <small>Categorías</small>

          {yugiohProducts.length > 0 && (
            <a
              href="#yugioh"
              onClick={closeMenu}
            >
              <Swords size={18} />
              <span>Yu-Gi-Oh!</span>
            </a>
          )}

          {pokemonProducts.length > 0 && (
            <a
              href="#pokemon"
              onClick={closeMenu}
            >
              <Sparkles size={18} />
              <span>Pokémon</span>
            </a>
          )}

          {onePieceProducts.length > 0 && (
            <a
              href="#one-piece"
              onClick={closeMenu}
            >
              <Shield size={18} />
              <span>One Piece</span>
            </a>
          )}

          {magicProducts.length > 0 && (
            <a
              href="#magic"
              onClick={closeMenu}
            >
              <WandSparkles size={18} />
              <span>Magic</span>
            </a>
          )}

          {accessoryProducts.length > 0 && (
            <a
              href="#accesorios"
              onClick={closeMenu}
            >
              <BriefcaseBusiness size={18} />
              <span>Accesorios</span>
            </a>
          )}

          {otherProducts.length > 0 && (
            <a
              href="#otros"
              onClick={closeMenu}
            >
              <CircleEllipsis size={18} />
              <span>Otros</span>
            </a>
          )}

          {preorderProducts.length > 0 && (
            <a
              href="#preventas"
              onClick={closeMenu}
            >
              <Clock size={18} />
              <span>Pre-ventas</span>
            </a>
          )}

          <small>Contacto</small>

          <a
            href={`https://wa.me/${storeConfig.store.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>
        </nav>
      </aside>
    </>
  );
}