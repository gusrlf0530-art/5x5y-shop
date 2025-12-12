import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { products } from "../data/products.js";

export default function CartDrawer() {
  const cart = useCart();

  const lines = Object.entries(cart.items).map(([id, qty]) => {
    const p = products.find((x) => x.id === id);
    return { id, qty, p, subtotal: (p?.price || 0) * qty };
  }).filter(x => x.p);

  const total = lines.reduce((s, x) => s + x.subtotal, 0);

  return (
    <>
      <div className={`overlay ${cart.isOpen ? "isOpen" : ""}`} onClick={cart.close} />
      <aside className={`drawer ${cart.isOpen ? "isOpen" : ""}`}>
        <div className="drawer__header">
          <div>
            <div className="drawer__title">Cart</div>
            <div className="muted">{lines.length} items</div>
          </div>
          <button className="iconBtn" onClick={cart.close}>✕</button>
        </div>

        <div className="drawer__content">
          {lines.length === 0 ? (
            <div className="empty">
              <div className="empty__title">Your cart is empty.</div>
              <div className="muted">Add items from Shop.</div>
              <Link className="btn" to="/shop" onClick={cart.close} style={{ marginTop: 12 }}>Go to Shop</Link>
            </div>
          ) : (
            <div className="cartList">
              {lines.map(({ id, qty, p, subtotal }) => (
                <div key={id} className="cartRow">
                  <img className="cartRow__img" src={p.images[0]} alt={p.name} />
                  <div className="cartRow__info">
                    <div className="cartRow__name">{p.name}</div>
                    <div className="muted">{p.color} · {p.category}</div>
                    <div className="muted">{p.price.toLocaleString("ko-KR")}₩</div>
                  </div>
                  <div className="cartRow__right">
                    <div className="qty">
                      <button className="qty__btn" onClick={() => cart.setQty(id, qty - 1)}>-</button>
                      <div className="qty__num">{qty}</div>
                      <button className="qty__btn" onClick={() => cart.setQty(id, qty + 1)}>+</button>
                    </div>
                    <div className="price">{subtotal.toLocaleString("ko-KR")}₩</div>
                    <button className="linkDanger" onClick={() => cart.remove(id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="drawer__footer">
          <div className="totalRow">
            <div>Total</div>
            <div className="price">{total.toLocaleString("ko-KR")}₩</div>
          </div>
          <div className="drawer__footerBtns">
            <button className="btn btn--ghost" onClick={cart.clear} disabled={lines.length === 0}>Clear</button>
            <Link className={`btn ${lines.length === 0 ? "isDisabled" : ""}`} to="/checkout" onClick={cart.close}>
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
