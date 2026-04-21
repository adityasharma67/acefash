import { ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutUser } from '../../features/auth/authSlice';

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold tracking-wide ${isActive ? 'text-[#d67d00]' : 'text-slate-700 hover:text-[#d67d00]'}`;

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
      className="sticky top-0 z-50 border-b border-amber-100 bg-white/90 backdrop-blur"
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900">
          AceFash
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full border border-amber-200 p-2 text-slate-800">
            <ShoppingCart size={18} />
            <span className="absolute -right-2 -top-2 rounded-full bg-[#d67d00] px-1.5 text-xs text-white">
              {cartCount}
            </span>
          </Link>

          {user ? (
            <>
              <span className="hidden items-center gap-1 text-sm font-semibold text-slate-700 md:inline-flex">
                {user.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 p-2 text-slate-700 hover:bg-slate-100"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;
