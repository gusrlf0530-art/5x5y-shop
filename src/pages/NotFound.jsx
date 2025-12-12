import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <h2>404</h2>
        <p className="muted">Page not found.</p>
        <Link className="btn" to="/">Go Home</Link>
      </div>
    </section>
  );
}
