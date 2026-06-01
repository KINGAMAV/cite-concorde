import CreateAnnouncement from '../components/CreateAnnouncement';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
console.log('📦 CreateAnnouncement importé:', typeof CreateAnnouncement);


interface Announcement {
  id: string;
  title: string;
  content: string;
  target_role: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .or(`target_role.eq.all,target_role.eq.${user?.role}`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) setAnnouncements(data);
      setLoading(false);
    };
    if (user) fetchAnnouncements();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Cité Concorde</h1>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">{user.role}</span>
        </div>
        <button onClick={logout} className="text-sm text-red-600 hover:text-red-800 font-medium border border-red-200 px-3 py-1.5 rounded hover:bg-red-50">
          Déconnexion
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-semibold text-blue-900">Bienvenue, {user.full_name}</h2>
          <p className="text-sm text-blue-700 mt-1">Espace {user.role} actif. Voici les dernières informations de la cité.</p>
        </div>
        <CreateAnnouncement />
        
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          📢 Annonces Récentes
        </h3>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-slate-400">Chargement...</div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center text-slate-500">
            Aucune annonce pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white p-5 rounded-lg border shadow-sm hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-slate-800 group-hover:text-blue-700 transition">{a.title}</h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    a.target_role === 'all' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {a.target_role}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{a.content}</p>
                <p className="text-xs text-slate-400">
                  {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}