import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { LayoutDashboard, Users, Swords, Trophy, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/mcs', label: 'MCs', icon: Users },
    { path: '/admin/batalhas', label: 'Batalhas', icon: Swords },
    { path: '/admin/torneios', label: 'Torneios', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="w-64 bg-zinc-900 border-r-2 border-zinc-800 flex flex-col">
        <div className="p-6 border-b-2 border-zinc-800">
          <h1 className="text-2xl font-black text-white">ADMIN PANEL</h1>
          <p className="text-sm text-gray-400">Batalha da Aldeia</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${
                      isActive(item.path)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t-2 border-zinc-800">
          <Link
            to="/"
            className="block w-full text-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-400 rounded-lg font-bold mb-2 transition-colors"
          >
            Ver Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-600 rounded-lg font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
