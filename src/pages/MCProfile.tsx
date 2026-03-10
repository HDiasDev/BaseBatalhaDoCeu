import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, MC, Batalha } from '../lib/supabase';
import { Trophy, MapPin, Instagram, TrendingUp, Swords } from 'lucide-react';
import Layout from '../components/Layout';

export default function MCProfile() {
  const { id } = useParams<{ id: string }>();
  const [mc, setMC] = useState<MC | null>(null);
  const [battles, setBattles] = useState<Batalha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMCData() {
      if (!id) return;

      const { data: mcData } = await supabase
        .from('mcs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      const { data: battlesData } = await supabase
        .from('batalhas')
        .select(`
          *,
          mc1:mc1_id(nome, foto),
          mc2:mc2_id(nome, foto),
          vencedor:vencedor_id(nome),
          torneio:torneio_id(nome)
        `)
        .or(`mc1_id.eq.${id},mc2_id.eq.${id}`)
        .order('data', { ascending: false });

      if (mcData) setMC(mcData);
      if (battlesData) setBattles(battlesData);
      setLoading(false);
    }

    fetchMCData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (!mc) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-black text-white mb-4">MC não encontrado</h1>
          <a href="/mcs" className="text-red-600 hover:text-red-500 font-bold">
            Voltar para lista de MCs
          </a>
        </div>
      </Layout>
    );
  }

  const winRate = mc.vitorias + mc.derrotas > 0
    ? ((mc.vitorias / (mc.vitorias + mc.derrotas)) * 100).toFixed(0)
    : 0;

  return (
    <Layout>
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12 border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={mc.foto}
              alt={mc.nome}
              className="w-48 h-48 rounded-full object-cover border-8 border-red-600"
            />
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-black text-white mb-4">{mc.nome}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {mc.cidade}
                </div>
                {mc.instagram && (
                  <a
                    href={`https://instagram.com/${mc.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-red-600 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    @{mc.instagram}
                  </a>
                )}
              </div>
              {mc.titulos && (
                <div className="inline-block bg-yellow-500/10 border-2 border-yellow-500 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-500 font-bold">
                    <Trophy className="w-5 h-5" />
                    {mc.titulos}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <div className="text-4xl font-black text-white mb-2">{mc.pontos}</div>
            <div className="text-gray-400 uppercase text-sm font-bold">Pontos</div>
          </div>
          <div className="bg-zinc-900 border-2 border-green-800 rounded-lg p-6 text-center">
            <Trophy className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-4xl font-black text-green-500 mb-2">{mc.vitorias}</div>
            <div className="text-gray-400 uppercase text-sm font-bold">Vitórias</div>
          </div>
          <div className="bg-zinc-900 border-2 border-red-800 rounded-lg p-6 text-center">
            <Swords className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <div className="text-4xl font-black text-red-500 mb-2">{mc.derrotas}</div>
            <div className="text-gray-400 uppercase text-sm font-bold">Derrotas</div>
          </div>
          <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6 text-center">
            <div className="text-4xl font-black text-white mb-2">{winRate}%</div>
            <div className="text-gray-400 uppercase text-sm font-bold">Taxa de Vitória</div>
          </div>
        </div>

        <section>
          <h2 className="text-3xl font-black text-white mb-6">HISTÓRICO DE BATALHAS</h2>
          <div className="space-y-4">
            {battles.map((battle) => {
              const isWinner = battle.vencedor_id === mc.id;
              const opponent = battle.mc1_id === mc.id ? battle.mc2 : battle.mc1;

              return (
                <div
                  key={battle.id}
                  className={`bg-zinc-900 border-2 rounded-lg p-6 ${
                    isWinner ? 'border-green-600' : 'border-red-600'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`px-4 py-2 rounded-lg font-black ${
                        isWinner ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {isWinner ? 'VITÓRIA' : 'DERROTA'}
                      </div>
                      <div className="text-white">
                        <div className="font-bold">vs {opponent?.nome}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(battle.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    {battle.torneio && (
                      <div className="text-gray-400 text-sm">
                        {battle.torneio.nome}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {battles.length === 0 && (
              <div className="text-center py-12 bg-zinc-900 rounded-lg">
                <p className="text-gray-400">Nenhuma batalha registrada ainda</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
