export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">NOIR STUDIO</div>
        <div className="footer__meta">© {new Date().getFullYear()} — Desktop-first fashion SPA demo.</div>
      </div>
    </footer>
  );
}
