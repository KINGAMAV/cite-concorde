import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ En attente', confirmed: '✅ Confirmée', preparing: '📦 En préparation',
  out_for_delivery: '🚚 En livraison', delivered: '🏠 Livrée', cancelled: '❌ Annulée'
};

export default function OrderManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  if (loading) return <div className="p-4 text-slate-500">Chargement...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr><th className="p-3">ID</th><th className="p-3">Résident</th><th className="p-3">Montant</th><th className="p-3">Adresse</th><th className="p-3">Statut</th><th className="p-3">Action</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b hover:bg-slate-50">
              <td className="p-3 font-mono text-xs text-slate-500">{o.id.slice(0, 8)}</td>
              <td className="p-3">{o.resident_id?.slice(0, 6)}...</td>
              <td className="p-3 font-medium">{Number(o.total_amount).toFixed(2)} €</td>
              <td className="p-3 text-slate-500 truncate max-w-[150px]">{o.delivery_address || '-'}</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100">{STATUS_LABELS[o.status]}</span></td>
              <td className="p-3">
                <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="border rounded px-2 py-1 text-xs bg-white">
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-slate-400">Aucune commande</td></tr>}
        </tbody>
      </table>
    </div>
  );
}