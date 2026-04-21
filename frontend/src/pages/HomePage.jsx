import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import ProductCard from '../components/ui/ProductCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

function HomePage() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const featured = products.slice(0, 6);

  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#d67d00] p-8 text-white md:p-12"
      >
        <p className="text-sm uppercase tracking-[0.25em] text-amber-200">Spring Summer 2026</p>
        <h1 className="mt-3 max-w-xl text-4xl font-black leading-tight md:text-6xl">Own your style with bold essentials</h1>
        <p className="mt-4 max-w-xl text-sm text-amber-50 md:text-base">
          Discover modern wardrobe staples designed for comfort, movement, and all-day confidence.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-slate-900"
        >
          Shop Collection
        </Link>
      </motion.section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-black text-slate-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-semibold text-[#d67d00]">
            View all
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
