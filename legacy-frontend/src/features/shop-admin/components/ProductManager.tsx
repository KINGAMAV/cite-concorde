import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: 'general', description: '' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('products').insert(form).select();
    if (!error && data) {
      setProducts(prev => [...data, ...prev]);
      setForm({ name: '', price: '', stock: '', category: 'general', description: '' });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="p-4 text-slate-500">Chargement...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulaire */}
      <div className="lg:col-span-1 bg-slate-50 p-4 rounded border">
        <h3 className="font-semibold mb-3">➕ Ajouter un produit</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded" required />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" step="0.01" placeholder="Prix (€)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-2 border rounded" required />
            <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full p-2 border rounded" required />
          </div>
          <input placeholder="Catégorie" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2 border rounded" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-2 border rounded h-20" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Publier</button>
        </form>
      </div>

      {/* Liste */}
      <div className="lg:col-span-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr><th className="p-2">Produit</th><th className="p-2">Prix</th><th className="p-2">Stock</th><th className="p-2">Cat.</th><th className="p-2"></th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="p-2 font-medium">{p.name}</td>
                <td className="p-2">{Number(p.price).toFixed(2)} €</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2 text-xs uppercase">{p.category}</td>
                <td className="p-2"><button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700 text-xs">🗑️</button></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-400">Aucun produit</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}