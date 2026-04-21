function Footer() {
  return (
    <footer className="mt-16 border-t border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 py-8">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 text-sm text-slate-600 md:grid-cols-2 md:px-8">
        <div>
          <p className="font-semibold text-slate-800">Aditya Sharma</p>
          <p>Email: adityasharma89000@gmail.com</p>
          <p>Contact: +91 7007380157</p>
        </div>

        <div className="md:text-right">
          <p>
            LinkedIn:{' '}
            <a
              className="text-[#ff523b] hover:underline"
              href="https://www.linkedin.com/in/aditya-sharma55/"
              target="_blank"
              rel="noreferrer"
            >
              aditya-sharma55
            </a>
          </p>
          <p>
            GitHub:{' '}
            <a
              className="text-[#ff523b] hover:underline"
              href="https://github.com/adityasharma67"
              target="_blank"
              rel="noreferrer"
            >
              adityasharma67
            </a>
          </p>
          <p>Copyright {new Date().getFullYear()} AceFash</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
