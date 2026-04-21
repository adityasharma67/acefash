import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../features/products/productSlice';
import { fetchAllOrders } from '../features/orders/orderSlice';
import { currency } from '../utils/currency';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { allOrders } = useSelector((state) => state.orders);
  const [editing, setEditing] = useState({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: null,
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('description', form.description);
      payload.append('price', form.price);
      payload.append('category', form.category);
      payload.append('stock', form.stock);

      if (form.images) {
        Array.from(form.images).forEach((image) => payload.append('images', image));
      }

      await dispatch(createProduct(payload)).unwrap();
      toast.success('Product created');
      setForm({ title: '', description: '', price: '', category: '', stock: '', images: null });
      dispatch(fetchProducts());
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleUpdate = async (id) => {
    const item = editing[id];
    if (!item) return;

    try {
      const payload = new FormData();
      payload.append('title', item.title);
      payload.append('description', item.description);
      payload.append('price', item.price);
      payload.append('category', item.category);
      payload.append('stock', item.stock);

      await dispatch(updateProduct({ id, payload })).unwrap();
      toast.success('Product updated');
      dispatch(fetchProducts());
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-amber-100 bg-white p-6">
        <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">Create products and monitor orders.</p>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-white p-6">
        <h2 className="mb-4 text-xl font-black text-slate-900">Create Product</h2>
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input required placeholder="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input type="file" multiple accept="image/*" onChange={(e) => setForm((p) => ({ ...p, images: e.target.files }))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm" rows={3} />
          <button type="submit" className="md:col-span-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Product</button>
        </form>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-white p-6">
        <h2 className="mb-4 text-xl font-black text-slate-900">Products</h2>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product._id} className="rounded-xl border border-slate-200 p-3">
              <div className="grid gap-2 md:grid-cols-5">
                <input
                  className="rounded border border-slate-200 px-2 py-1 text-sm"
                  value={(editing[product._id]?.title ?? product.title)}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      [product._id]: {
                        ...(prev[product._id] || product),
                        title: e.target.value,
                      },
                    }))
                  }
                />
                <input
                  className="rounded border border-slate-200 px-2 py-1 text-sm"
                  value={(editing[product._id]?.category ?? product.category)}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      [product._id]: {
                        ...(prev[product._id] || product),
                        category: e.target.value,
                      },
                    }))
                  }
                />
                <input
                  type="number"
                  className="rounded border border-slate-200 px-2 py-1 text-sm"
                  value={(editing[product._id]?.price ?? product.price)}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      [product._id]: {
                        ...(prev[product._id] || product),
                        price: e.target.value,
                      },
                    }))
                  }
                />
                <input
                  type="number"
                  className="rounded border border-slate-200 px-2 py-1 text-sm"
                  value={(editing[product._id]?.stock ?? product.stock)}
                  onChange={(e) =>
                    setEditing((prev) => ({
                      ...prev,
                      [product._id]: {
                        ...(prev[product._id] || product),
                        stock: e.target.value,
                      },
                    }))
                  }
                />
                <p className="text-sm text-slate-500">{currency(product.price)} current</p>
              </div>
              <textarea
                rows={2}
                className="mt-2 w-full rounded border border-slate-200 px-2 py-1 text-sm"
                value={(editing[product._id]?.description ?? product.description)}
                onChange={(e) =>
                  setEditing((prev) => ({
                    ...prev,
                    [product._id]: {
                      ...(prev[product._id] || product),
                      description: e.target.value,
                    },
                  }))
                }
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleUpdate(product._id)}
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-sm font-semibold text-white"
                >
                  Update
                </button>
                <button onClick={() => handleDelete(product._id)} className="rounded-lg bg-rose-600 px-3 py-1 text-sm font-semibold text-white">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-white p-6">
        <h2 className="mb-4 text-xl font-black text-slate-900">All Orders</h2>
        <div className="space-y-3">
          {allOrders.map((order) => (
            <div key={order._id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm text-slate-500">{order.user?.email}</p>
              <p className="font-semibold text-slate-900">{currency(order.totalPrice)}</p>
              <p className="text-sm text-slate-600">{order.orderStatus}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
