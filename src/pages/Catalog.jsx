import { useMemo, useState } from "react";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Catalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("Featured");

  const categories = useMemo(() => ["All", ...new Set(products.map(p => p.category))], []);

  const list = useMemo(() => {
    let arr = [...products];

    if (cat !== "All") arr = arr.filter(p => p.category === cat);

    const query = q.trim().toLowerCase();
    if (query) arr = arr.filter(p => (p.name + " " + p.description).toLowerCase().includes(query));

    if (sort === "Price ↑") arr.sort((a,b)=>a.price-b.price);
    if (sort === "Price ↓") arr.sort((a,b)=>b.price-a.price);

    return arr;
  }, [q, cat, sort]);

  return (
    <section className="section">
      <div className="container section__head">
        <h2>Shop</h2>
        <div className="muted">{list.length} products</div>
      </div>

      <div className="container toolbar">
        <input className="input" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search…" />
        <select className="select" value={cat} onChange={(e)=>setCat(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="select" value={sort} onChange={(e)=>setSort(e.target.value)}>
          <option>Featured</option>
          <option>Price ↑</option>
          <option>Price ↓</option>
        </select>
      </div>

      <div className="container grid">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
