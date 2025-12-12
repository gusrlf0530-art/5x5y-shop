import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";

export default function Product() {
  const { id } = useParams();
  const cart = useCart();
  const p = useMemo(() => products.find(x => x.id === id), [id]);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);

  if (!p) return (
    <section className="section">
      <div className="container">
        <h2>Product not found</h2>
        <Link className="link" to="/shop">Back to Shop →</Link>
      </div>
    </section>
  );

  return (
    <section className="section">
      <div className="container breadcrumb">
        <Link className="link" to="/shop">Shop</Link>
        <span className="muted">/</span>
        <span>{p.name}</span>
      </div>

      <div className="container product">
        <div className="product__gallery">
          <div className="product__mainImg">
            <img src={p.images[img]} alt={p.name} />
          </div>
          <div className="product__thumbs">
            {p.images.map((src, i) => (
              <button key={src} className={`thumb ${i===img ? "isActive":""}`} onClick={()=>setImg(i)}>
                <img src={src} alt={`${p.name} ${i+1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product__info">
          <div className="kicker">{p.category} · {p.color}</div>
          <h2 className="product__title">{p.name}</h2>
          <div className="price product__price">{p.price.toLocaleString("ko-KR")}₩</div>
          <p className="muted">{p.description}</p>

          <div className="row">
            <div className="qty qty--lg">
              <button className="qty__btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <div className="qty__num">{qty}</div>
              <button className="qty__btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn" onClick={() => cart.add(p.id, qty)}>Add to Cart</button>
          </div>

          <div className="spec">
            <div className="spec__row"><span className="muted">Shipping</span><span>2–3 days</span></div>
            <div className="spec__row"><span className="muted">Returns</span><span>7 days</span></div>
            <div className="spec__row"><span className="muted">Care</span><span>Dry clean recommended</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
