import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <h1 className="text-4xl font-black text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">Page not found</p>
      <Link to="/" className="mt-5 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm text-white">
        Back Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
