import { Link } from "react-router-dom";
import { products } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <div className="kicker">FW DROP 01</div>
            <h1 className="hero__title">Quiet luxury, built for the city.</h1>
            <p className="hero__desc">
              Minimal silhouettes, precise tailoring, and refined textures. Desktop-first shopping experience.
            </p>
            <div className="hero__actions">
              <Link className="btn" to="/shop">Shop New Arrivals</Link>
              <a className="btn btn--ghost" href="#about">Brand Story</a>
            </div>
          </div>

          <div className="hero__media">
            <img
              src="https://images.pexels.com/photos/5709663/pexels-photo-5709663.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Campaign"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section__head">
          <h2>Featured</h2>
          <Link className="link" to="/shop">View all →</Link>
        </div>

        <div className="container grid">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <section id="about" className="section section--dark">
        <div className="container about">
          <div>
            <h2>About NOIR STUDIO</h2>
            <p className="muted">
              This is a clean SPA template: routing, product detail, cart drawer, and checkout flow.
              Replace the product data and imagery with your brand assets to make it real.
            </p>
          </div>
          <div className="about__cards">
            <div className="miniCard">
              <div className="miniCard__title">Material-first</div>
              <div className="muted">Images + data separated for easy swap.</div>
            </div>
            <div className="miniCard">
              <div className="miniCard__title">Desktop UX</div>
              <div className="muted">Wide layout, drawer cart, dense grid.</div>
            </div>
            <div className="miniCard">
              <div className="miniCard__title">SPA Routing</div>
              <div className="muted">Home / Shop / Product / Checkout.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
