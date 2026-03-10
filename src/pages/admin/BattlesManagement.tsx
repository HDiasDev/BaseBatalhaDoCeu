import { useEffect, useState, FormEvent } from 'react';
import { supabase, MC, Batalha, Torneio } from '../../lib/supabase';
import { Plus, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function BattlesManagement() {
  const [battles, setBattles] = useState<Batalha[]>([]);
  const [mcs, setMCs] = useState<MC[]>([]);
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mc1_id: '',
    mc2_id: '',
    vencedor_id: '',
    data: new Date().toISOString().split('T')[0],
    torneio_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [battlesResult, mcsResult, torneiosResult] = await Promise.all([
      supabase
        .from('batalhas')
        .select(`
          *,
          mc1:mc1_id(nome, foto),
          mc2:mc2_id(nome, foto),
          vencedor:vencedor_id(nome),
          torneio:torneio_id(nome)
        `)
        .order('data', { ascending: false }),
      supabase.from('mcs').select('*').order('nome'),
      supabase.from('torneios').select('*').order('nome'),
    ]);

    if (battlesResult.data) setBattles(battlesResult.data);
    if (mcsResult.data) setMCs(mcsResult.data);
    if (torneiosResult.data) setTorneios(torneiosResult.data);
    setLoading(false);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.mc1_id === formData.mc2_id) {
      alert('Os MCs devem ser diferentes!');
      return;
    }

    const batalhaData = {
      mc1_id: formData.mc1_id,
      mc2_id: formData.mc2_id,
      vencedor_id: formData.vencedor_id || null,
      data: formData.data,
      torneio_id: formData.torneio_id || null,
    };

    const { error } = await supabase.from('batalhas').insert([batalhaData]);

    if (error) {
      alert('Erro ao registrar batalha');
      return;
    }

    if (formData.vencedor_id) {
      const perdedor_id = formData.vencedor_id === formData.mc1_id ? formData.mc2_id : formData.mc1_id;

      await Promise.all([
        supabase.rpc('increment_mc_stats', {
          mc_id: formData.vencedor_id,
          stat: 'vitorias',
        }),
        supabase.rpc('increment_mc_stats', {
          mc_id: perdedor_id,
          stat: 'derrotas',
        }),
      ]);

      const vencedor = mcs.find((mc) => mc.id === formData.vencedor_id);
      if (vencedor) {
        await supabase
          .from('mcs')
          .update({ pontos: vencedor.pontos + 3 })
          .eq('id', formData.vencedor_id);
      }
    }

    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta batalha?')) return;

    await supabase.from('batalhas').delete().eq('id', id);
    fetchData();
  };

  const resetForm = () => {
    setFormData({
      mc1_id: '',
      mc2_id: '',
      vencedor_id: '',
      data: new Date().toISOString().split('T')[0],
      torneio_id: '',
    });
    setShowForm(false);
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
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Gerenciar Batalhas</h1>
            <p className="text-gray-400">Registre resultados e atualize o ranking</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Registrar Batalha
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-lg p-8 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">Registrar Batalha</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">MC 1 *</label>
                    <select
                      required
                      value={formData.mc1_id}
                      onChange={(e) => setFormData({ ...formData, mc1_id: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="">Selecione...</option>
                      {mcs.map((mc) => (
                        <option key={mc.id} value={mc.id}>
                          {mc.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">MC 2 *</label>
                    <select
                      required
                      value={formData.mc2_id}
                      onChange={(e) => setFormData({ ...formData, mc2_id: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="">Selecione...</option>
                      {mcs.map((mc) => (
                        <option key={mc.id} value={mc.id}>
                          {mc.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Vencedor</label>
                  <select
                    value={formData.vencedor_id}
                    onChange={(e) => setFormData({ ...formData, vencedor_id: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                  >
                    <option value="">Sem resultado / Empate</option>
                    {formData.mc1_id && (
                      <option value={formData.mc1_id}>
                        {mcs.find((mc) => mc.id === formData.mc1_id)?.nome}
                      </option>
                    )}
                    {formData.mc2_id && (
                      <option value={formData.mc2_id}>
                        {mcs.find((mc) => mc.id === formData.mc2_id)?.nome}
                      </option>
                    )}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Ao selecionar um vencedor, vitórias/derrotas e pontos serão atualizados automaticamente
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Data *</label>
                    <input
                      type="date"
                      required
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Torneio</label>
                    <select
                      value={formData.torneio_id}
                      onChange={(e) => setFormData({ ...formData, torneio_id: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="">Nenhum</option>
                      {torneios.map((torneio) => (
                        <option key={torneio.id} value={torneio.id}>
                          {torneio.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    Registrar Batalha
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {battles.map((battle) => (
            <div
              key={battle.id}
              className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
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

                <div className="flex items-center gap-4">
                  {battle.vencedor && (
                    <div className="bg-green-600 px-4 py-2 rounded-lg">
                      <span className="text-white font-bold text-sm">
                        Vencedor: {battle.vencedor.nome}
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-gray-400 text-sm">
                      {new Date(battle.data).toLocaleDateString('pt-BR')}
                    </div>
                    {battle.torneio && (
                      <div className="text-gray-500 text-xs">{battle.torneio.nome}</div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(battle.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {battles.length === 0 && (
          <div className="text-center py-12 bg-zinc-900 rounded-lg">
            <p className="text-gray-400">Nenhuma batalha registrada ainda</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
