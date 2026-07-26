import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'librarian') return '/dashboard/librarian';
    return '/dashboard/user';
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-brand' : 'text-gray-600 hover:text-black'
    }`;

  return (
    <header className="w-full sticky top-0 z-50">
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 border-brand/15 backdrop-blur-xl shadow-sm'
            : 'bg-white/90 border-transparent backdrop-blur-md'
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-4 md:px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
              <BookOpen className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-display font-extrabold text-xl tracking-tight text-[#1a1f36]">
              Biblio<span className="text-brand">Drop</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/browse" className={navLinkClass}>
              Catalog
            </NavLink>
            <Link to="/browse" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Sales
            </Link>
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-3 text-sm font-medium">
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="text-gray-600 hover:text-brand transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="text-gray-500 hover:text-black transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-brand transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-brand px-4 py-2 text-white hover:bg-brand-deep transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-brand rounded-xl border border-brand/15"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-brand/10 bg-white px-4 py-4 flex flex-col gap-1">
            <Link to="/" className="py-3 text-sm font-medium text-gray-700 hover:text-brand" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/browse" className="py-3 text-sm font-medium text-gray-700 hover:text-brand" onClick={() => setIsOpen(false)}>
              Catalog
            </Link>
            {!user ? (
              <>
                <Link to="/login" className="py-3 text-sm font-medium text-gray-700 hover:text-brand" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="py-3 text-sm font-medium text-brand" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="py-3 text-sm font-medium text-gray-700 hover:text-brand" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="py-3 text-left text-sm font-medium text-gray-500">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
