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
        className="relative -mx-4 overflow-hidden bg-[#ffd6d6] px-8 py-14 md:-mx-8 md:px-16 md:py-20"
      >
        <div className="mx-auto grid max-w-[1500px] items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-[#1a1a2e] md:text-7xl">
              Give Your Workout
              <br />
              <span className="text-[#ff523b]">A New Style!</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600">
              Success isn&apos;t always about greatness. It&apos;s about consistency. Consistent hard
              work gains success. Greatness would come.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-block rounded-full bg-[#ff523b] px-8 py-3 text-base font-semibold text-white transition hover:brightness-110"
            >
              Explore Now →
            </Link>
          </div>

          <div className="relative">
            <img
              src="/image1.png"
              alt="Hero"
              className="mx-auto w-full max-w-2xl object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </motion.section>

      <section className="mx-auto w-full max-w-6xl px-0 md:px-2">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-black text-slate-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-semibold text-[#ff523b]">
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
