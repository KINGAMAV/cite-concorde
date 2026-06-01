import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ProductManager from './components/ProductManager';
import OrderManager from './components/OrderManager';

export default function ShopAdmin() {
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: pCount }, { count: oCount }, { rows: revRows }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount').eq('status', 'delivered')
      ]);
      setStats({
        products: pCount || 0,
        orders: oCount || 0,
        revenue: revRows?.reduce((acc: number, curr: any) => acc + Number(curr.total_amount), 0) || 0
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-6 text-slate-500">Chargement du module boutique...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">🏪 ConcordeShop - Administration</h1>
        <p className="text-slate-500">Gestion catalogue, commandes & statistiques</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Produits actifs" value={stats.products} color="bg-blue-50 text-blue-700 border-blue-200" />
        <StatCard label="Commandes totales" value={stats.orders} color="bg-purple-50 text-purple-700 border-purple-200" />
        <StatCard label="Revenus (livrés)" value={`${stats.revenue.toFixed(2)} €`} color="bg-green-50 text-green-700 border-green-200" />
      </div>

      <div className="flex gap-2 mb-4 border-b">
        <TabButton active={tab === 'products'} onClick={() => setTab('products')}>📦 Produits</TabButton>
        <TabButton active={tab === 'orders'} onClick={() => setTab('orders')}>🛒 Commandes</TabButton>
      </div>

      <div className="bg-white rounded-lg border p-4 min-h-[400px]">
        {tab === 'products' ? <ProductManager /> : <OrderManager />}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  return <div className={`p-4 rounded-lg border ${color} shadow-sm`}>
    <p className="text-xs font-medium uppercase opacity-80">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>;
}

function TabButton({ active, onClick, children }: any) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium transition ${
      active ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'
    }`}>
      {children}
    </button>
  );
}
