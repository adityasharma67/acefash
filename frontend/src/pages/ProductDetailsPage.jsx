import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProductById } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { currency } from '../utils/currency';

function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading || !product) {
    return <p className="text-sm text-slate-500">Loading product details...</p>;
  }

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId: product._id,
        title: product.title,
        image: product.images?.[0],
        price: product.price,
        quantity,
        stock: product.stock,
      })
    );
    toast.success('Added to cart');
  };

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <img
        src={
          product.images?.[0]
            ? `${import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000'}${product.images[0]}`
            : 'https://placehold.co/800x650/F5F5F5/1f2937?text=No+Image'
        }
        alt={product.title}
        className="h-[420px] w-full rounded-2xl object-cover"
      />

      <div className="space-y-4 rounded-2xl border border-amber-100 bg-white p-6">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          {product.category}
        </span>
        <h1 className="text-3xl font-black text-slate-900">{product.title}</h1>
        <p className="text-slate-600">{product.description}</p>
        <p className="text-3xl font-black text-[#d67d00]">{currency(product.price)}</p>
        <p className="text-sm text-slate-600">Stock: {product.stock}</p>

        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 rounded-lg border border-slate-200 px-3 py-2"
          />
          <button
            onClick={handleAdd}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-[#d67d00]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
