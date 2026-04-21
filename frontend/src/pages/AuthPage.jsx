import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { loginUser, registerUser } from '../features/auth/authSlice';

function AuthPage() {
  const dispatch = useDispatch();
  const { token, loading } = useSelector((state) => state.auth);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (token) return <Navigate to="/dashboard" replace />;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
        toast.success('Logged in successfully');
      } else {
        await dispatch(registerUser(form)).unwrap();
        toast.success('Account created successfully');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex rounded-xl bg-amber-50 p-1">
        <button
          onClick={() => setMode('login')}
          className={`w-1/2 rounded-lg px-4 py-2 text-sm font-semibold ${
            mode === 'login' ? 'bg-slate-900 text-white' : 'text-slate-700'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode('register')}
          className={`w-1/2 rounded-lg px-4 py-2 text-sm font-semibold ${
            mode === 'register' ? 'bg-slate-900 text-white' : 'text-slate-700'
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        {mode === 'register' && (
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        )}

        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>
    </section>
  );
}

export default AuthPage;
