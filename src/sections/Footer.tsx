export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="gold">S</span>uman <span className="gold">R</span>aj <span className="gold">K</span>hanal
        </div>
        <div className="footer-copy">
          © {year} · Made with ❤ in Kathmandu, Nepal
        </div>
      </div>
    </footer>
  );
}
