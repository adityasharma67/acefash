import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import { addToCart } from '../../features/cart/cartSlice';
import { currency } from '../../utils/currency';
import { imagePlaceholder, resolveImageSrc } from '../../utils/image';

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        title: product.title,
        image: product.images?.[0],
        price: product.price,
        quantity: 1,
        stock: product.stock,
      })
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition"
    >
      <Link to={`/products/${product._id}`}>
        <img
          src={resolveImageSrc(product.images?.[0], imagePlaceholder)}
          alt={product.title}
          onError={(e) => {
            e.currentTarget.src = imagePlaceholder;
          }}
          className="h-52 w-full rounded-xl object-cover"
        />
      </Link>

      <div className="mt-4 space-y-2">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-slate-900">{product.title}</h3>
        <p className="text-xl font-black text-[#d67d00]">{currency(product.price)}</p>
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-[#d67d00]"
      >
        <ShoppingBag size={16} />
        Add to Cart
      </button>
    </motion.article>
  );
}

export default ProductCard;
