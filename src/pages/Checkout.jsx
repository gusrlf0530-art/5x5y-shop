import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { products } from "../data/products.js";

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const lines = useMemo(() => Object.entries(cart.items).map(([id, qty]) => {
    const p = products.find(x => x.id === id);
    return p ? { id, qty, p, subtotal: p.price * qty } : null;
  }).filter(Boolean), [cart.items]);

  const total = lines.reduce((s, x) => s + x.subtotal, 0);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("주문자 정보(이름/전화/주소)를 입력하세요.");
      return;
    }
    // 데모: 실제 결제/주문 API는 여기서 호출
    cart.clear();
    alert("주문 완료(데모)!");
    navigate("/");
  };

  if (lines.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <h2>Checkout</h2>
          <div className="muted">Cart is empty.</div>
          <Link className="btn" to="/shop" style={{ marginTop: 12 }}>Go to Shop</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container section__head">
        <h2>Checkout</h2>
        <div className="muted">Demo checkout form</div>
      </div>

      <div className="container checkout">
        <form className="panel" onSubmit={submit}>
          <div className="panel__title">Customer</div>
          <label className="field">
            <div className="field__label">Name</div>
            <input className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
          </label>
          <label className="field">
            <div className="field__label">Phone</div>
            <input className="input" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
          </label>
          <label className="field">
            <div className="field__label">Address</div>
            <input className="input" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
          </label>

          <button className="btn" type="submit" style={{ marginTop: 12 }}>Place Order</button>
          <button className="btn btn--ghost" type="button" onClick={() => cart.open()} style={{ marginTop: 8 }}>
            Review Cart
          </button>
        </form>

        <div className="panel">
          <div className="panel__title">Order Summary</div>
          <div className="summary">
            {lines.map(({ id, qty, p, subtotal }) => (
              <div key={id} className="summary__row">
                <div>
                  <div className="summary__name">{p.name}</div>
                  <div className="muted">Qty {qty}</div>
                </div>
                <div className="price">{subtotal.toLocaleString("ko-KR")}₩</div>
              </div>
            ))}
            <div className="summary__total">
              <div>Total</div>
              <div className="price">{total.toLocaleString("ko-KR")}₩</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
