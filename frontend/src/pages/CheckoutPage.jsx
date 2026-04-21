import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createOrder } from '../features/orders/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import { currency } from '../utils/currency';

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items.length) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      await dispatch(
        createOrder({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          shippingAddress: form,
          paymentMethod: 'mock',
        })
      ).unwrap();

      dispatch(clearCart());
      toast.success('Order placed successfully (mock payment)');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-amber-100 bg-white p-6">
        <h1 className="text-2xl font-black text-slate-900">Checkout</h1>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            required
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={form[key]}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        ))}

        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Placing order...' : 'Pay & Place Order'}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border border-amber-100 bg-white p-6">
        <h3 className="text-xl font-black text-slate-900">Order Summary</h3>
        <p className="mt-3 text-sm text-slate-500">Items: {items.length}</p>
        <p className="text-2xl font-black text-[#d67d00]">{currency(subtotal)}</p>
        <p className="mt-2 text-xs text-slate-500">Tax and shipping are calculated on the server at order time.</p>
      </aside>
    </div>
  );
}

export default CheckoutPage;
