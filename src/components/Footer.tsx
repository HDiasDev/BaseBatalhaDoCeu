import { Instagram, Youtube, Music } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-red-600 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-red-600" />
              BATALHA DA ALDEIA
            </h3>
            <p className="text-gray-400 text-sm">
              A maior liga de batalha de rap da região.
              Venha fazer parte dessa cultura!
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">NAVEGAÇÃO</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-red-600 transition-colors">Home</a></li>
              <li><a href="/mcs" className="hover:text-red-600 transition-colors">MCs</a></li>
              <li><a href="/ranking" className="hover:text-red-600 transition-colors">Ranking</a></li>
              <li><a href="/torneios" className="hover:text-red-600 transition-colors">Torneios</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">REDES SOCIAIS</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-600 p-3 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-600 p-3 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Batalha da Aldeia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
