function Footer() {
  return (
    <footer className="mt-16 border-t border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-600 md:flex-row md:px-8">
        <p>Built for modern commerce experiences.</p>
        <p>Copyright {new Date().getFullYear()} AceFash</p>
      </div>
    </footer>
  );
}

export default Footer;
