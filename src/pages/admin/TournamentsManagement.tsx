import { useEffect, useState, FormEvent } from 'react';
import { supabase, Torneio } from '../../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function TournamentsManagement() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTorneio, setEditingTorneio] = useState<Torneio | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    local: '',
    premio: '',
  });

  useEffect(() => {
    fetchTorneios();
  }, []);

  async function fetchTorneios() {
    const { data } = await supabase
      .from('torneios')
      .select('*')
      .order('data', { ascending: false });

    if (data) setTorneios(data);
    setLoading(false);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingTorneio) {
      await supabase
        .from('torneios')
        .update(formData)
        .eq('id', editingTorneio.id);
    } else {
      await supabase.from('torneios').insert([formData]);
    }

    resetForm();
    fetchTorneios();
  };

  const handleEdit = (torneio: Torneio) => {
    setEditingTorneio(torneio);
    setFormData({
      nome: torneio.nome,
      data: torneio.data,
      local: torneio.local,
      premio: torneio.premio || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este torneio?')) return;

    await supabase.from('torneios').delete().eq('id', id);
    fetchTorneios();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      data: '',
      local: '',
      premio: '',
    });
    setEditingTorneio(null);
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
            <h1 className="text-4xl font-black text-white mb-2">Gerenciar Torneios</h1>
            <p className="text-gray-400">Crie e organize competições</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Criar Torneio
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-lg p-8 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">
                  {editingTorneio ? 'Editar Torneio' : 'Criar Torneio'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Nome *</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    placeholder="Ex: Batalha de Verão 2024"
                  />
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
                    <label className="block text-sm font-bold text-white mb-2">Local *</label>
                    <input
                      type="text"
                      required
                      value={formData.local}
                      onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                      placeholder="Ex: Praça Central"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Prêmio</label>
                  <input
                    type="text"
                    value={formData.premio}
                    onChange={(e) => setFormData({ ...formData, premio: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    placeholder="Ex: R$ 1.000 + Troféu"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    {editingTorneio ? 'Salvar Alterações' : 'Criar Torneio'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {torneios.map((torneio) => {
            const isPast = new Date(torneio.data) < new Date();

            return (
              <div
                key={torneio.id}
                className="bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <div
                  className={`p-4 ${
                    isPast
                      ? 'bg-zinc-800'
                      : 'bg-gradient-to-r from-red-600 to-red-700'
                  }`}
                >
                  <h3 className="text-xl font-black text-white mb-2">{torneio.nome}</h3>
                  <div className="text-sm text-white/80">
                    {new Date(torneio.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold">Local</div>
                      <div className="text-white font-bold">{torneio.local}</div>
                    </div>
                    {torneio.premio && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Prêmio</div>
                        <div className="text-yellow-500 font-bold">{torneio.premio}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(torneio)}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(torneio.id)}
                      className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {torneios.length === 0 && (
          <div className="text-center py-12 bg-zinc-900 rounded-lg">
            <p className="text-gray-400">Nenhum torneio cadastrado ainda</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
