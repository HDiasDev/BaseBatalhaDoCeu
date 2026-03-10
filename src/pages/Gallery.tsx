import { useEffect, useState } from 'react';
import { supabase, Video } from '../lib/supabase';
import { Youtube } from 'lucide-react';
import Layout from '../components/Layout';

export default function Gallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setVideos(data);
      setLoading(false);
    }

    fetchVideos();
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
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">GALERIA</h1>
          <p className="text-gray-400 text-lg">Melhores momentos das batalhas</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden hover:border-red-600 transition-all group"
            >
              <div className="aspect-video relative overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  title={video.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-2 line-clamp-2">{video.titulo}</h3>
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-500 text-sm font-bold"
                >
                  <Youtube className="w-4 h-4" />
                  Ver no YouTube
                </a>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <Youtube className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhum vídeo cadastrado ainda</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
