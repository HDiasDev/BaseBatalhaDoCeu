import { useEffect, useState, FormEvent } from 'react';
import { supabase, MC } from '../../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function MCsManagement() {
  const [mcs, setMCs] = useState<MC[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMC, setEditingMC] = useState<MC | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cidade: '',
    foto: '',
    instagram: '',
    vitorias: 0,
    derrotas: 0,
    titulos: '',
    pontos: 0,
  });

  useEffect(() => {
    fetchMCs();
  }, []);

  async function fetchMCs() {
    const { data } = await supabase
      .from('mcs')
      .select('*')
      .order('nome');

    if (data) setMCs(data);
    setLoading(false);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingMC) {
      await supabase
        .from('mcs')
        .update(formData)
        .eq('id', editingMC.id);
    } else {
      await supabase.from('mcs').insert([formData]);
    }

    resetForm();
    fetchMCs();
  };

  const handleEdit = (mc: MC) => {
    setEditingMC(mc);
    setFormData({
      nome: mc.nome,
      cidade: mc.cidade,
      foto: mc.foto,
      instagram: mc.instagram || '',
      vitorias: mc.vitorias,
      derrotas: mc.derrotas,
      titulos: mc.titulos || '',
      pontos: mc.pontos,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este MC?')) return;

    await supabase.from('mcs').delete().eq('id', id);
    fetchMCs();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cidade: '',
      foto: '',
      instagram: '',
      vitorias: 0,
      derrotas: 0,
      titulos: '',
      pontos: 0,
    });
    setEditingMC(null);
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
            <h1 className="text-4xl font-black text-white mb-2">Gerenciar MCs</h1>
            <p className="text-gray-400">Adicione, edite ou remova MCs</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar MC
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">
                  {editingMC ? 'Editar MC' : 'Adicionar MC'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    URL da Foto *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.foto}
                    onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    placeholder="username"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Vitórias
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.vitorias}
                      onChange={(e) => setFormData({ ...formData, vitorias: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Derrotas
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.derrotas}
                      onChange={(e) => setFormData({ ...formData, derrotas: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Títulos
                  </label>
                  <input
                    type="text"
                    value={formData.titulos}
                    onChange={(e) => setFormData({ ...formData, titulos: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    placeholder="Ex: Campeão 2023, Vice 2022"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Pontos
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pontos}
                    onChange={(e) => setFormData({ ...formData, pontos: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    {editingMC ? 'Salvar Alterações' : 'Adicionar MC'}
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

        <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase">
                    MC
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-400 uppercase">
                    Cidade
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-400 uppercase">
                    V/D
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-400 uppercase">
                    Pontos
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-400 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {mcs.map((mc) => (
                  <tr key={mc.id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={mc.foto}
                          alt={mc.nome}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-white font-bold">{mc.nome}</div>
                          {mc.instagram && (
                            <div className="text-sm text-gray-400">@{mc.instagram}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{mc.cidade}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-500 font-bold">{mc.vitorias}</span>
                      <span className="text-gray-500 mx-1">/</span>
                      <span className="text-red-500 font-bold">{mc.derrotas}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white font-black text-lg">{mc.pontos}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(mc)}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-500 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mc.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {mcs.length === 0 && (
          <div className="text-center py-12 bg-zinc-900 rounded-lg mt-6">
            <p className="text-gray-400">Nenhum MC cadastrado ainda</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
