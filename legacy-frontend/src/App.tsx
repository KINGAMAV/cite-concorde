import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ShopAdmin from './pages/ShopAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './routes/RoleGuard';

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <h1 className="text-3xl font-bold text-red-600">Accès non autorisé</h1>
      <p className="mt-2 text-slate-600">Votre rôle ne correspond pas à cette section.</p>
      <button onClick={() => window.location.href = '/login'} className="mt-4 text-blue-600 hover:underline">Retour</button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Route Admin avec ProtectedRoute existant */}
          <Route path="/admin" element={
            <RoleGuard allowedRoles={['admin', 'syndic']}>
              <ShopAdmin />
            </RoleGuard>
          } />
          
          {/* Route par défaut → redirige vers admin si admin/syndic, sinon resident */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}