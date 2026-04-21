import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function AppLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1da_0%,#fffaf2_45%,#f9fafb_100%)] text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
