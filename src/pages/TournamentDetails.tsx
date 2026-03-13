import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Batalha, supabase, Torneio } from '../lib/supabase';
import { getPhaseLabel, groupBattlesByPhase, PHASE_ORDER, sortBattlesByBracketFlow } from '../lib/tournament';
import { Trophy } from 'lucide-react';

export default function TournamentDetails() {
  const { id } = useParams();
  const [torneio, setTorneio] = useState<Torneio | null>(null);
  const [batalhas, setBatalhas] = useState<Batalha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const [torneioResult, batalhasResult] = await Promise.all([
        supabase.from('torneios').select('*, campeao:campeao_id(id, nome, foto)').eq('id', id).single(),
        supabase
          .from('batalhas')
          .select('*, mc1:mc1_id(id, nome, foto), mc2:mc2_id(id, nome, foto), vencedor:vencedor_id(id, nome, foto)')
          .eq('torneio_id', id),
      ]);

      if (torneioResult.data) setTorneio(torneioResult.data);
      if (batalhasResult.data) setBatalhas(batalhasResult.data);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  const grouped = useMemo(() => groupBattlesByPhase(batalhas), [batalhas]);
  const orderedPhases = useMemo(
    () => Object.keys(grouped).sort((a, b) => PHASE_ORDER.indexOf(a) - PHASE_ORDER.indexOf(b)),
    [grouped],
  );

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!torneio) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-300">Torneio não encontrado.</p>
        </div>
      </Layout>
    );
  }

  const hasBracket = batalhas.length > 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div>
          <Link to="/torneios" className="text-red-500 hover:text-red-400 text-sm font-bold">← Voltar para torneios</Link>
          <h1 className="text-4xl font-black text-white mt-2">{torneio.nome}</h1>
          <p className="text-gray-400">{torneio.local} • {new Date(torneio.data).toLocaleDateString('pt-BR')}</p>
        </div>

        {torneio.campeao && (
          <div className="border border-yellow-500/40 bg-yellow-500/10 rounded-xl p-5 flex items-center gap-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-yellow-300 font-bold">MC Campeão</p>
              <p className="text-2xl text-white font-black">{torneio.campeao.nome}</p>
            </div>
          </div>
        )}

        {!hasBracket ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-gray-400">
            Chaveamento ainda não foi gerado para este torneio.
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <h2 className="text-2xl text-white font-black">Fases e batalhas</h2>
              {orderedPhases.map((phase) => (
                <div key={phase} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-red-500 mb-3">{getPhaseLabel(phase)}</h3>
                  <div className="space-y-3">
                    {sortBattlesByBracketFlow(grouped[phase]).map((battle) => (
                      <div key={battle.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white font-semibold">{battle.mc1?.nome || 'A definir'} vs {battle.mc2?.nome || 'A definir'}</span>
                          <span className="text-gray-400">Placar: {battle.placar_mc1 ?? '-'} x {battle.placar_mc2 ?? '-'}</span>
                        </div>
                        {battle.vencedor && <p className="text-green-400 text-xs mt-1 font-bold">Vencedor: {battle.vencedor.nome}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl text-white font-black">Chaveamento completo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                {orderedPhases.slice().reverse().map((phase) => (
                  <div key={`bracket-${phase}`} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <h3 className="text-sm uppercase text-gray-400 font-bold mb-3">{getPhaseLabel(phase)}</h3>
                    <div className="space-y-3">
                      {grouped[phase].map((battle) => (
                        <div key={battle.id} className="bg-zinc-950 rounded-md p-3 text-sm border border-zinc-800">
                          <p className={`font-semibold ${battle.vencedor_id === battle.mc1_id ? 'text-green-400' : 'text-white'}`}>{battle.mc1?.nome || 'A definir'} <span className="text-gray-500">({battle.placar_mc1 ?? '-'})</span></p>
                          <p className={`font-semibold ${battle.vencedor_id === battle.mc2_id ? 'text-green-400' : 'text-white'}`}>{battle.mc2?.nome || 'A definir'} <span className="text-gray-500">({battle.placar_mc2 ?? '-'})</span></p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
