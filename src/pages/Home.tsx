import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, MC, Batalha } from '../lib/supabase';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';

export default function Home() {
  const [topMCs, setTopMCs] = useState<MC[]>([]);
  const [recentBattles, setRecentBattles] = useState<Batalha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: mcsData } = await supabase
        .from('mcs')
        .select('*')
        .order('pontos', { ascending: false })
        .limit(5);

      const { data: battlesData } = await supabase
        .from('batalhas')
        .select(`
          *,
          mc1:mc1_id(nome, foto),
          mc2:mc2_id(nome, foto),
          vencedor:vencedor_id(nome),
          torneio:torneio_id(nome)
        `)
        .order('data', { ascending: false })
        .limit(3);

      if (mcsData) setTopMCs(mcsData);
      if (battlesData) setRecentBattles(battlesData);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-red-600 to-black py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            BATALHA DA ALDEIA
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-bold">
            A MAIOR LIGA DE RAP BATTLE DA REGIÃO
          </p>
          <Link
            to="/mcs"
            className="inline-block bg-white text-black px-8 py-4 rounded-lg font-black text-lg hover:bg-gray-100 transition-colors"
          >
            CONHEÇA OS MCs
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-black text-white">TOP 5 RANKING</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topMCs.map((mc, index) => (
              <Link
                key={mc.id}
                to={`/mcs/${mc.id}`}
                className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6 hover:border-red-600 transition-all group"
              >
                <div className="text-center">
                  <div className="text-4xl font-black text-red-600 mb-3">#{index + 1}</div>
                  <img
                    src={mc.foto}
                    alt={mc.nome}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-zinc-800 group-hover:border-red-600 transition-colors"
                  />
                  <h3 className="text-lg font-bold text-white mb-1">{mc.nome}</h3>
                  <p className="text-sm text-gray-400 mb-2">{mc.cidade}</p>
                  <div className="text-2xl font-black text-red-600">{mc.pontos} pts</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/ranking"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 font-bold"
            >
              <TrendingUp className="w-5 h-5" />
              VER RANKING COMPLETO
            </Link>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-black text-white">ÚLTIMAS BATALHAS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBattles.map((battle) => (
              <div
                key={battle.id}
                className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={battle.mc1?.foto}
                      alt={battle.mc1?.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className="text-white font-bold">{battle.mc1?.nome}</span>
                  </div>
                  <span className="text-gray-500 font-bold">VS</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{battle.mc2?.nome}</span>
                    <img
                      src={battle.mc2?.foto}
                      alt={battle.mc2?.nome}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                </div>
                {battle.vencedor && (
                  <div className="text-center py-3 bg-red-600 rounded-lg">
                    <span className="text-white font-bold">
                      VENCEDOR: {battle.vencedor.nome}
                    </span>
                  </div>
                )}
                <div className="mt-4 text-center text-sm text-gray-400">
                  {new Date(battle.data).toLocaleDateString('pt-BR')}
                  {battle.torneio && ` • ${battle.torneio.nome}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
