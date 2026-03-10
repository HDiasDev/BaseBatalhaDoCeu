import { useEffect, useState } from 'react';
import { supabase, Torneio } from '../lib/supabase';
import { Calendar, MapPin, Award } from 'lucide-react';
import Layout from '../components/Layout';

export default function Tournaments() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTorneios() {
      const { data } = await supabase
        .from('torneios')
        .select('*')
        .order('data', { ascending: false });

      if (data) setTorneios(data);
      setLoading(false);
    }

    fetchTorneios();
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
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12 border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">TORNEIOS</h1>
          <p className="text-gray-400 text-lg">Competições e eventos especiais</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {torneios.map((torneio) => {
            const isPast = new Date(torneio.data) < new Date();

            return (
              <div
                key={torneio.id}
                className="bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden hover:border-red-600 transition-all"
              >
                <div className={`p-4 ${isPast ? 'bg-zinc-800' : 'bg-gradient-to-r from-red-600 to-red-700'}`}>
                  <h3 className="text-2xl font-black text-white mb-2">{torneio.nome}</h3>
                  <div className="flex items-center gap-2 text-gray-200 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(torneio.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Local</div>
                        <div className="text-white font-bold">{torneio.local}</div>
                      </div>
                    </div>

                    {torneio.premio && (
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                        <div>
                          <div className="text-xs text-gray-500 uppercase font-bold mb-1">Prêmio</div>
                          <div className="text-yellow-500 font-bold">{torneio.premio}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {isPast && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <span className="inline-block bg-zinc-800 text-gray-400 px-3 py-1 rounded-full text-xs font-bold">
                        CONCLUÍDO
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {torneios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum torneio cadastrado ainda</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
