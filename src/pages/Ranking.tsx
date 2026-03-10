import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, MC } from '../lib/supabase';
import { Trophy, Medal, Award } from 'lucide-react';
import Layout from '../components/Layout';

export default function Ranking() {
  const [mcs, setMCs] = useState<MC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      const { data } = await supabase
        .from('mcs')
        .select('*')
        .order('pontos', { ascending: false });

      if (data) setMCs(data);
      setLoading(false);
    }

    fetchRanking();
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

  const getMedalIcon = (position: number) => {
    if (position === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (position === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === 2) return <Award className="w-6 h-6 text-amber-700" />;
    return null;
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12 border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">RANKING</h1>
          <p className="text-gray-400 text-lg">Classificação geral dos MCs</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase tracking-wider">
                    MC
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase tracking-wider">
                    Cidade
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-400 uppercase tracking-wider">
                    Vitórias
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-400 uppercase tracking-wider">
                    Derrotas
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-400 uppercase tracking-wider">
                    Pontos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {mcs.map((mc, index) => (
                  <tr
                    key={mc.id}
                    className="hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(index)}
                        <span className="text-2xl font-black text-white">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/mcs/${mc.id}`}
                        className="flex items-center gap-3 hover:text-red-600 transition-colors"
                      >
                        <img
                          src={mc.foto}
                          alt={mc.nome}
                          className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700"
                        />
                        <div>
                          <div className="text-white font-bold">{mc.nome}</div>
                          {mc.titulos && (
                            <div className="text-xs text-yellow-500">{mc.titulos}</div>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {mc.cidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-green-500 font-bold text-lg">{mc.vitorias}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-red-500 font-bold text-lg">{mc.derrotas}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-white font-black text-xl">{mc.pontos}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {mcs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum MC cadastrado ainda</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
