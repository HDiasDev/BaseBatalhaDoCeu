import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, MC } from '../lib/supabase';
import { Trophy, MapPin } from 'lucide-react';
import Layout from '../components/Layout';

export default function MCsList() {
  const [mcs, setMCs] = useState<MC[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchMCs() {
      const { data } = await supabase
        .from('mcs')
        .select('*')
        .order('nome');

      if (data) setMCs(data);
      setLoading(false);
    }

    fetchMCs();
  }, []);

  const filteredMCs = mcs.filter((mc) =>
    mc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mc.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">MCs</h1>
          <p className="text-gray-400 text-lg">Conheça os guerreiros do microfone</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar MC por nome ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-3 bg-zinc-900 border-2 border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMCs.map((mc) => (
            <Link
              key={mc.id}
              to={`/mcs/${mc.id}`}
              className="bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden hover:border-red-600 transition-all group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={mc.foto}
                  alt={mc.nome}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-black text-white mb-2">{mc.nome}</h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  {mc.cidade}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-green-500 font-bold">{mc.vitorias}V</div>
                    <div className="text-gray-500 text-xs">Vitórias</div>
                  </div>
                  <div>
                    <div className="text-red-500 font-bold">{mc.derrotas}D</div>
                    <div className="text-gray-500 text-xs">Derrotas</div>
                  </div>
                  <div>
                    <div className="text-yellow-500 font-bold flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {mc.pontos}
                    </div>
                    <div className="text-gray-500 text-xs">Pontos</div>
                  </div>
                </div>
                {mc.titulos && (
                  <div className="mt-3 pt-3 border-t border-zinc-800">
                    <div className="text-xs text-gray-500 mb-1">TÍTULOS</div>
                    <div className="text-sm text-yellow-500 font-bold">{mc.titulos}</div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredMCs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum MC encontrado</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
