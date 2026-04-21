import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartQuantity } from '../features/cart/cartSlice';
import { currency } from '../utils/currency';

function CartPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="text-2xl font-black text-slate-900">Your cart is empty</h2>
        <Link to="/products" className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-2 text-white">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        {items.map((item) => (
          <article key={item.productId} className="flex gap-4 rounded-2xl border border-amber-100 bg-white p-4">
            <img
              src={
                item.image
                  ? `${import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000'}${item.image}`
                  : 'https://placehold.co/200x200/F5F5F5/1f2937?text=Item'
              }
              alt={item.title}
              className="h-24 w-24 rounded-xl object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500">{currency(item.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateCartQuantity({
                        productId: item.productId,
                        quantity: Number(e.target.value),
                      })
                    )
                  }
                  className="w-20 rounded-lg border border-slate-200 px-2 py-1"
                />
                <button
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  className="text-sm font-semibold text-rose-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-2xl border border-amber-100 bg-white p-6">
        <h3 className="text-xl font-black text-slate-900">Cart Summary</h3>
        <p className="mt-3 text-sm text-slate-600">Subtotal</p>
        <p className="text-2xl font-black text-[#d67d00]">{currency(subtotal)}</p>
        <Link
          to="/checkout"
          className="mt-5 inline-block w-full rounded-xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
        >
          Proceed to Checkout
        </Link>
      </aside>
    </div>
  );
}

export default CartPage;
