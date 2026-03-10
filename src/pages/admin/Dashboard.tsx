import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Swords, Trophy, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

interface Stats {
  totalMCs: number;
  totalBatalhas: number;
  totalTorneios: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalMCs: 0,
    totalBatalhas: 0,
    totalTorneios: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [mcsResult, batalhasResult, torneiosResult] = await Promise.all([
        supabase.from('mcs').select('*', { count: 'exact', head: true }),
        supabase.from('batalhas').select('*', { count: 'exact', head: true }),
        supabase.from('torneios').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalMCs: mcsResult.count || 0,
        totalBatalhas: batalhasResult.count || 0,
        totalTorneios: torneiosResult.count || 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">{stats.totalMCs}</div>
                <div className="text-sm text-gray-400">MCs</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">Total de MCs cadastrados</div>
          </div>

          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <Swords className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">{stats.totalBatalhas}</div>
                <div className="text-sm text-gray-400">Batalhas</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">Total de batalhas registradas</div>
          </div>

          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">{stats.totalTorneios}</div>
                <div className="text-sm text-gray-400">Torneios</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">Total de torneios criados</div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-700 border-2 border-red-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">
                  {stats.totalBatalhas > 0 ? Math.floor(stats.totalBatalhas / stats.totalMCs) : 0}
                </div>
                <div className="text-sm text-white/80">Média</div>
              </div>
            </div>
            <div className="text-sm text-white/80">Batalhas por MC</div>
          </div>
        </div>

        <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6">
          <h2 className="text-2xl font-black text-white mb-4">Links Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/mcs"
              className="flex items-center gap-3 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Users className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-white font-bold">Gerenciar MCs</div>
                <div className="text-sm text-gray-400">Adicionar e editar MCs</div>
              </div>
            </a>
            <a
              href="/admin/batalhas"
              className="flex items-center gap-3 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Swords className="w-6 h-6 text-red-500" />
              <div>
                <div className="text-white font-bold">Registrar Batalhas</div>
                <div className="text-sm text-gray-400">Adicionar resultados</div>
              </div>
            </a>
            <a
              href="/admin/torneios"
              className="flex items-center gap-3 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-white font-bold">Criar Torneios</div>
                <div className="text-sm text-gray-400">Organizar competições</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
