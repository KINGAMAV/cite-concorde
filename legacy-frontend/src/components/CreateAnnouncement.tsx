import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function CreateAnnouncement() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetRole, setTargetRole] = useState('all');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Masqué si pas admin ou syndic
  if (!user || !['admin', 'syndic'].includes(user.role)) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase.from('announcements').insert({
      title,
      content,
      target_role: targetRole,
      author_id: user.id
    });

    if (!error) {
      setTitle('');
      setContent('');
      setTargetRole('all');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">📝 Publier une annonce</h3>
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm border border-green-200">✅ Annonce publiée avec succès !</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded p-2.5" required />
        <textarea placeholder="Contenu..." value={content} onChange={e => setContent(e.target.value)} className="w-full border rounded p-2.5 h-24 resize-none" required />
        <select value={targetRole} onChange={e => setTargetRole(e.target.value)} className="w-full border rounded p-2.5 bg-white">
          <option value="all">Tous les résidents</option>
          <option value="resident">Résidents uniquement</option>
          <option value="livreur">Livreurs</option>
          <option value="prestataire">Prestataires</option>
          <option value="boutique">Boutiques/Restaurants</option>
        </select>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700 disabled:opacity-50 font-medium">
          {loading ? 'Publication...' : 'Publier l\'annonce'}
        </button>
      </form>
    </div>
  );
}