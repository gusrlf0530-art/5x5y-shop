import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ p }) {
  const cart = useCart();
  return (
    <div className="card">
      <Link to={`/product/${p.id}`} className="card__media">
        <img src={p.images[0]} alt={p.name} />
        <div className="card__chips">
          {p.tags?.slice(0, 2).map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </Link>

      <div className="card__body">
        <div className="card__top">
          <div>
            <div className="muted">{p.category} · {p.color}</div>
            <div className="card__title">{p.name}</div>
          </div>
          <div className="price">{p.price.toLocaleString("ko-KR")}₩</div>
        </div>

        <div className="card__actions">
          <Link className="btn btn--ghost" to={`/product/${p.id}`}>View</Link>
          <button className="btn" onClick={() => cart.add(p.id, 1)}>Add</button>
        </div>
      </div>
    </div>
  );
}
