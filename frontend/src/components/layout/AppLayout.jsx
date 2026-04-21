import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function AppLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="w-full px-4 py-6 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
