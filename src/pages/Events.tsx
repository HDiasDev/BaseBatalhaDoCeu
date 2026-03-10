import { useEffect, useState } from 'react';
import { supabase, Evento } from '../lib/supabase';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Layout from '../components/Layout';

export default function Events() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventos() {
      const { data } = await supabase
        .from('eventos')
        .select('*')
        .order('data', { ascending: true });

      if (data) setEventos(data);
      setLoading(false);
    }

    fetchEventos();
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = eventos.filter((evento) => new Date(evento.data) >= today);
  const pastEvents = eventos.filter((evento) => new Date(evento.data) < today);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-12 border-b-4 border-red-600">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">EVENTOS</h1>
          <p className="text-gray-400 text-lg">Agenda de batalhas e encontros</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {upcomingEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <Clock className="w-8 h-8 text-red-600" />
              PRÓXIMOS EVENTOS
            </h2>
            <div className="space-y-4">
              {upcomingEvents.map((evento) => (
                <div
                  key={evento.id}
                  className="bg-gradient-to-r from-red-600/20 to-transparent border-2 border-red-600 rounded-lg p-6 hover:border-red-500 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-3">{evento.nome}</h3>
                      <div className="flex flex-wrap gap-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-red-600" />
                          {new Date(evento.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-red-600" />
                          {evento.local}
                        </div>
                      </div>
                      {evento.descricao && (
                        <p className="mt-3 text-gray-400">{evento.descricao}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="bg-red-600 px-4 py-2 rounded-lg text-center">
                        <div className="text-3xl font-black text-white">
                          {new Date(evento.data).getDate()}
                        </div>
                        <div className="text-xs text-white uppercase">
                          {new Date(evento.data).toLocaleDateString('pt-BR', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-black text-white mb-6">EVENTOS ANTERIORES</h2>
            <div className="space-y-4">
              {pastEvents.map((evento) => (
                <div
                  key={evento.id}
                  className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6 opacity-60"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-white mb-2">{evento.nome}</h3>
                      <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(evento.data).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {evento.local}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {eventos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum evento cadastrado ainda</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
