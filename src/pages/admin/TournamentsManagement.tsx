import { useCallback, useEffect, useMemo, useState, FormEvent } from 'react';
import { supabase, Batalha, MC, Torneio, TorneioParticipante } from '../../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, X, Swords, Trophy } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { generateBracketMatches, getPhaseLabel, groupBattlesByPhase, PHASE_ORDER } from '../../lib/tournament';

export default function TournamentsManagement() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [mcs, setMCs] = useState<MC[]>([]);
  const [participants, setParticipants] = useState<TorneioParticipante[]>([]);
  const [matches, setMatches] = useState<Batalha[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTorneio, setEditingTorneio] = useState<Torneio | null>(null);
  const [formData, setFormData] = useState({ nome: '', data: '', local: '', premio: '' });

  useEffect(() => {
    fetchBaseData();
  }, [fetchBaseData]);

  useEffect(() => {
    if (selectedTournamentId) {
      fetchTournamentStructure(selectedTournamentId);
    } else {
      setParticipants([]);
      setMatches([]);
    }
  }, [selectedTournamentId]);

  const fetchBaseData = useCallback(async () => {
    const [torneiosResult, mcsResult] = await Promise.all([
      supabase.from('torneios').select('*, campeao:campeao_id(id, nome, foto)').order('data', { ascending: false }),
      supabase.from('mcs').select('*').order('nome'),
    ]);

    if (torneiosResult.data) {
      setTorneios(torneiosResult.data);
      if (!selectedTournamentId && torneiosResult.data[0]) {
        setSelectedTournamentId(torneiosResult.data[0].id);
      }
    }

    if (mcsResult.data) setMCs(mcsResult.data);
    setLoading(false);
  }, [selectedTournamentId]);

  async function fetchTournamentStructure(tournamentId: string) {
    const [participantsResult, matchesResult] = await Promise.all([
      supabase
        .from('torneio_participantes')
        .select('*, mc:mc_id(*)')
        .eq('torneio_id', tournamentId)
        .order('seed', { ascending: true, nullsFirst: false }),
      supabase
        .from('batalhas')
        .select('*, mc1:mc1_id(id, nome, foto), mc2:mc2_id(id, nome, foto), vencedor:vencedor_id(id, nome, foto)')
        .eq('torneio_id', tournamentId),
    ]);

    setParticipants(participantsResult.data || []);
    setMatches(matchesResult.data || []);
  }

  const handleSubmitTournament = async (e: FormEvent) => {
    e.preventDefault();

    if (editingTorneio) {
      await supabase.from('torneios').update(formData).eq('id', editingTorneio.id);
    } else {
      await supabase.from('torneios').insert([formData]);
    }

    resetForm();
    await fetchBaseData();
  };

  const handleEdit = (torneio: Torneio) => {
    setEditingTorneio(torneio);
    setFormData({ nome: torneio.nome, data: torneio.data, local: torneio.local, premio: torneio.premio || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este torneio?')) return;
    await supabase.from('torneios').delete().eq('id', id);
    if (selectedTournamentId === id) setSelectedTournamentId('');
    await fetchBaseData();
  };

  const resetForm = () => {
    setFormData({ nome: '', data: '', local: '', premio: '' });
    setEditingTorneio(null);
    setShowForm(false);
  };

  const selectedTournament = useMemo(
    () => torneios.find((torneio) => torneio.id === selectedTournamentId),
    [torneios, selectedTournamentId],
  );

  const groupedMatches = useMemo(() => groupBattlesByPhase(matches), [matches]);
  const orderedPhases = useMemo(
    () => Object.keys(groupedMatches).sort((a, b) => PHASE_ORDER.indexOf(a) - PHASE_ORDER.indexOf(b)),
    [groupedMatches],
  );

  const toggleParticipant = async (mcId: string) => {
    if (!selectedTournamentId) return;

    const exists = participants.find((participant) => participant.mc_id === mcId);

    if (exists) {
      await supabase.from('torneio_participantes').delete().eq('id', exists.id);
    } else {
      await supabase.from('torneio_participantes').insert([{ torneio_id: selectedTournamentId, mc_id: mcId }]);
    }

    await fetchTournamentStructure(selectedTournamentId);
  };

  const generateBracket = async () => {
    if (!selectedTournament) return;
    const participantMCs = participants.map((participant) => participant.mc).filter(Boolean) as MC[];

    try {
      const matchRows = generateBracketMatches(participantMCs, selectedTournament.id, selectedTournament.data);
      await supabase.from('batalhas').delete().eq('torneio_id', selectedTournament.id);

      const { data: inserted, error } = await supabase.from('batalhas').insert(matchRows).select('*');
      if (error || !inserted) {
        alert('Erro ao gerar chaveamento.');
        return;
      }

      const byPhase: Record<string, Batalha[]> = {};
      inserted.forEach((battle: Batalha) => {
        if (!byPhase[battle.fase || '']) byPhase[battle.fase || ''] = [];
        byPhase[battle.fase || ''].push(battle);
      });

      Object.values(byPhase).forEach((arr) => arr.sort((a, b) => (a.ordem_na_fase || 0) - (b.ordem_na_fase || 0)));
      const phaseNames = Object.keys(byPhase).sort((a, b) => PHASE_ORDER.indexOf(b) - PHASE_ORDER.indexOf(a));

      for (let i = 0; i < phaseNames.length - 1; i += 1) {
        const current = byPhase[phaseNames[i]];
        const next = byPhase[phaseNames[i + 1]];

        for (let m = 0; m < current.length; m += 1) {
          const nextBattle = next[Math.floor(m / 2)];
          const slot = m % 2 === 0 ? 1 : 2;
          await supabase.from('batalhas').update({ proxima_batalha_id: nextBattle.id, proxima_slot: slot }).eq('id', current[m].id);
        }
      }

      await supabase.from('torneios').update({ campeao_id: null }).eq('id', selectedTournament.id);
      await fetchTournamentStructure(selectedTournament.id);
      await fetchBaseData();
      alert('Chaveamento gerado com sucesso!');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const updateBattleResult = async (battle: Batalha, score1: number, score2: number, winnerId: string | null) => {
    await supabase
      .from('batalhas')
      .update({ placar_mc1: score1, placar_mc2: score2, vencedor_id: winnerId })
      .eq('id', battle.id);

    if (battle.proxima_batalha_id) {
      const updates = battle.proxima_slot === 1 ? { mc1_id: winnerId } : { mc2_id: winnerId };
      await supabase.from('batalhas').update(updates).eq('id', battle.proxima_batalha_id);
    } else if (battle.fase === 'final' && selectedTournamentId) {
      await supabase.from('torneios').update({ campeao_id: winnerId }).eq('id', selectedTournamentId);
    }

    if (selectedTournamentId) {
      await fetchTournamentStructure(selectedTournamentId);
      await fetchBaseData();
    }
  };

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
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Gerenciamento de Torneios</h1>
            <p className="text-gray-400">Criação, chaveamento, placares e avanço automático</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            <Plus className="w-5 h-5" />
            Criar Torneio
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-lg p-8 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">{editingTorneio ? 'Editar Torneio' : 'Criar Torneio'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleSubmitTournament} className="space-y-4">
                <input required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" placeholder="Nome" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="date" required value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" />
                  <input required value={formData.local} onChange={(e) => setFormData({ ...formData, local: e.target.value })} className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" placeholder="Local" />
                </div>
                <input value={formData.premio} onChange={(e) => setFormData({ ...formData, premio: e.target.value })} className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" placeholder="Prêmio" />
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">Salvar</button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3 lg:col-span-1">
            <h2 className="text-lg font-black text-white">Torneios</h2>
            {torneios.map((torneio) => (
              <div key={torneio.id} className={`rounded-lg border p-3 ${selectedTournamentId === torneio.id ? 'border-red-600 bg-red-600/10' : 'border-zinc-800 bg-zinc-950'}`}>
                <button onClick={() => setSelectedTournamentId(torneio.id)} className="w-full text-left">
                  <p className="font-bold text-white">{torneio.nome}</p>
                  <p className="text-xs text-gray-400">{new Date(torneio.data).toLocaleDateString('pt-BR')}</p>
                </button>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleEdit(torneio)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-blue-600/20 text-blue-400 rounded"><Edit2 className="w-4 h-4" />Editar</button>
                  <button onClick={() => handleDelete(torneio.id)} className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-600/20 text-red-400 rounded"><Trash2 className="w-4 h-4" />Excluir</button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedTournament ? (
              <>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-black text-white">MCs participantes</h3>
                    <button onClick={generateBracket} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm"><Swords className="w-4 h-4" />Gerar chaveamento</button>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Selecione os MCs e gere os confrontos iniciais automaticamente (necessário potência de 2).</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-auto">
                    {mcs.map((mc) => {
                      const selected = participants.some((participant) => participant.mc_id === mc.id);
                      return (
                        <button key={mc.id} onClick={() => toggleParticipant(mc.id)} className={`text-left px-3 py-2 rounded border ${selected ? 'border-red-600 bg-red-600/10 text-white' : 'border-zinc-700 bg-zinc-950 text-gray-300'}`}>
                          {mc.nome}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-black text-white">Batalhas por fase</h3>
                  {orderedPhases.length === 0 && <p className="text-gray-400 text-sm">Ainda sem chaveamento gerado.</p>}
                  {orderedPhases.map((phase) => (
                    <div key={phase} className="border border-zinc-800 rounded-lg p-3">
                      <h4 className="text-red-500 font-bold mb-2">{getPhaseLabel(phase)}</h4>
                      <div className="space-y-2">
                        {groupedMatches[phase].map((battle) => (
                          <BattleEditor key={battle.id} battle={battle} onSave={updateBattleResult} />
                        ))}
                      </div>
                    </div>
                  ))}

                  {selectedTournament.campeao && (
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3 flex items-center gap-2 text-yellow-300 font-bold">
                      <Trophy className="w-5 h-5" /> Campeão: {selectedTournament.campeao.nome}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-gray-400">Selecione um torneio para começar o gerenciamento.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function BattleEditor({ battle, onSave }: { battle: Batalha; onSave: (battle: Batalha, score1: number, score2: number, winnerId: string | null) => Promise<void> }) {
  const [score1, setScore1] = useState(battle.placar_mc1 ?? 0);
  const [score2, setScore2] = useState(battle.placar_mc2 ?? 0);
  const [winnerId, setWinnerId] = useState<string>(battle.vencedor_id || '');

  useEffect(() => {
    setScore1(battle.placar_mc1 ?? 0);
    setScore2(battle.placar_mc2 ?? 0);
    setWinnerId(battle.vencedor_id || '');
  }, [battle]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
      <p className="text-white font-semibold text-sm mb-2">{battle.mc1?.nome || 'A definir'} vs {battle.mc2?.nome || 'A definir'}</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
        <input type="number" min={0} value={score1} onChange={(e) => setScore1(Number(e.target.value))} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-white" placeholder="Placar MC1" />
        <input type="number" min={0} value={score2} onChange={(e) => setScore2(Number(e.target.value))} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-white" placeholder="Placar MC2" />
        <select value={winnerId} onChange={(e) => setWinnerId(e.target.value)} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-white">
          <option value="">Sem vencedor</option>
          {battle.mc1_id && <option value={battle.mc1_id}>{battle.mc1?.nome || 'MC 1'}</option>}
          {battle.mc2_id && <option value={battle.mc2_id}>{battle.mc2?.nome || 'MC 2'}</option>}
        </select>
        <button onClick={() => onSave(battle, score1, score2, winnerId || null)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-bold">Salvar</button>
      </div>
    </div>
  );
}
