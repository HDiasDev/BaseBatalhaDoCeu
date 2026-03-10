import { Link, useLocation } from 'react-router-dom';
import { Mic2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/mcs', label: 'MCs' },
    { path: '/ranking', label: 'RANKING' },
    { path: '/torneios', label: 'TORNEIOS' },
    { path: '/eventos', label: 'EVENTOS' },
    { path: '/galeria', label: 'GALERIA' },
  ];

  return (
    <header className="bg-black text-white border-b-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-colors">
              <Mic2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">BATALHA DA ALDEIA</h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Rap Battle League</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-colors ${
                  isActive(link.path)
                    ? 'text-red-600'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold text-sm transition-colors"
            >
              ADMIN
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-bold tracking-wide transition-colors ${
                    isActive(link.path)
                      ? 'text-red-600'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold text-sm transition-colors text-center"
              >
                ADMIN
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
