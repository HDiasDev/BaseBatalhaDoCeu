import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import MCsList from './pages/MCsList';
import MCProfile from './pages/MCProfile';
import Ranking from './pages/Ranking';
import Tournaments from './pages/Tournaments';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Login from './pages/Login';

import AdminDashboard from './pages/admin/Dashboard';
import MCsManagement from './pages/admin/MCsManagement';
import BattlesManagement from './pages/admin/BattlesManagement';
import TournamentsManagement from './pages/admin/TournamentsManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mcs" element={<MCsList />} />
          <Route path="/mcs/:id" element={<MCProfile />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/torneios" element={<Tournaments />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mcs"
            element={
              <ProtectedRoute>
                <MCsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/batalhas"
            element={
              <ProtectedRoute>
                <BattlesManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/torneios"
            element={
              <ProtectedRoute>
                <TournamentsManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
