import { ShoppingCart, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutUser } from '../../features/auth/authSlice';

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold tracking-[0.08em] uppercase ${
    isActive
      ? 'text-[#ff523b] border-b-2 border-[#ff523b] pb-1'
      : 'text-slate-500 hover:text-[#ff523b]'
  }`;

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((acc, item) => acc + Number(item.quantity || 0), 0)
  );

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      dispatch(logout());
    }
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur"
    >
      <nav className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-6 py-4 lg:px-12">
        <Link to="/" className="shrink-0">
          <img src="/logo.png" alt="AceFash" className="h-16 w-auto object-contain" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-600 hover:text-[#ff523b]"
            >
              Logout ({user.name?.split(' ')[0] || 'User'})
            </button>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full border border-slate-300 p-2 text-slate-800">
            <ShoppingCart size={18} />
            <span className="absolute -right-2 -top-2 rounded-full bg-[#ff523b] px-1.5 text-xs text-white">
              {cartCount}
            </span>
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-300 p-2 text-slate-700 md:hidden"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <Link to="/login" className="text-xs font-semibold uppercase tracking-wide text-slate-600 md:hidden">
              Login
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;
