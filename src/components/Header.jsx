import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const cart = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header__inner">
        <button className="brand" onClick={() => navigate("/")}>
          NOIR STUDIO
        </button>

        <nav className="nav">
          <NavLink className={({ isActive }) => (isActive ? "nav__link isActive" : "nav__link")} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? "nav__link isActive" : "nav__link")} to="/shop">
            Shop
          </NavLink>
          <a className="nav__link" href="#about" onClick={(e) => {
            if (location.pathname !== "/") { e.preventDefault(); navigate("/"); setTimeout(()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth"}), 50); }
          }}>
            About
          </a>
        </nav>

        <div className="header__actions">
          <button className="btn btn--ghost" onClick={cart.toggle}>
            Cart <span className="badge">{cart.count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
