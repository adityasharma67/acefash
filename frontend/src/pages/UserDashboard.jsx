import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orders/orderSlice';
import { currency } from '../utils/currency';

function UserDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myOrders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-100 bg-white p-6">
        <h1 className="text-2xl font-black text-slate-900">Welcome, {user?.name}</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your orders and account activity.</p>
        <Link to="/products" className="mt-4 inline-block rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
          Continue Shopping
        </Link>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-white p-6">
        <h2 className="text-xl font-black text-slate-900">Order History</h2>
        <div className="mt-4 space-y-3">
          {myOrders.length ? (
            myOrders.map((order) => (
              <article key={order._id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Order ID: {order._id}</p>
                <p className="font-semibold text-slate-900">Total: {currency(order.totalPrice)}</p>
                <p className="text-sm text-slate-600">Status: {order.orderStatus}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-500">No orders yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;
