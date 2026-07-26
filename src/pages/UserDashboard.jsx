import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import Card from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Book, Truck, DollarSign, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', user.email],
    queryFn: async () => {
      const res = await api.get(`/stats/user-stats/${user.email}`);
      return res.data.data;
    }
  });

  const { data: deliveries, isLoading: deliveriesLoading } = useQuery({
    queryKey: ['userDeliveries', user.email],
    queryFn: async () => {
      const res = await api.get(`/deliveries/user/${user.email}`);
      return res.data.data;
    }
  });

  if (statsLoading || deliveriesLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const chartData = [
    { name: 'Books Read', value: stats.totalBooksRead },
    { name: 'Pending', value: stats.pendingDeliveries },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px-300px)]">
      <aside className="w-full md:w-64 bg-brand-panel border-r border-brand/15 p-6 shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-deep rounded-full overflow-hidden border border-brand/30">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-brand-deep"></div>
            )}
          </div>
          <div>
            <h2 className="font-bold text-sm text-black">{user.name}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-mono">{user.role}</p>
          </div>
        </div>
        <nav className="space-y-2">
          <a href="#overview" className="block px-3 py-2 text-sm font-medium bg-brand text-white">Overview</a>
          <a href="#history" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-brand-ink hover:text-brand transition-colors">History</a>
          <a href="#reviews" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-brand-ink hover:text-brand transition-colors">My Reviews</a>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-black mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand/10 border border-brand/20 text-brand"><Book className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide font-mono">Books Read</p>
                <p className="text-2xl font-bold text-black">{stats.totalBooksRead}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand/10 border border-brand/20 text-brand"><Truck className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide font-mono">Pending Deliveries</p>
                <p className="text-2xl font-bold text-black">{stats.pendingDeliveries}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand/10 border border-brand/20 text-brand"><DollarSign className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide font-mono">Total Spent</p>
                <p className="text-2xl font-bold text-black">${stats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Card className="col-span-1 lg:col-span-1 p-6 flex flex-col justify-center">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wide text-gray-600 mb-6">Activity Summary</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9aabbc' }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,123,107,0.08)' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(255,123,107,0.3)', borderRadius: '2px', color: '#1f1416' }}
                  />
                  <Bar dataKey="value" fill="#FF7B6B" radius={[2, 2, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="col-span-1 lg:col-span-2 p-6 overflow-hidden flex flex-col">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wide text-gray-600 mb-6" id="history">Delivery History</h3>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand/15">
                    <th className="pb-3 font-medium text-gray-400">Book</th>
                    <th className="pb-3 font-medium text-gray-400">Date</th>
                    <th className="pb-3 font-medium text-gray-400">Fee</th>
                    <th className="pb-3 font-medium text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand/10">
                  {deliveries?.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-400">No delivery history found.</td>
                    </tr>
                  )}
                  {deliveries?.map(del => (
                    <tr key={del._id} className="hover:bg-brand-ink transition-colors">
                      <td className="py-4">
                        <Link to={`/books/${del.bookId}`} className="font-bold text-black hover:text-brand transition-colors">{del.bookTitle}</Link>
                      </td>
                      <td className="py-4 text-gray-400">{new Date(del.requestDate).toLocaleDateString()}</td>
                      <td className="py-4 font-medium text-gray-700">${del.deliveryFee.toFixed(2)}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider font-mono ${
                          del.status === 'delivered' ? 'bg-brand-deep text-white' : 'bg-brand-ink text-gray-700 border border-brand/15'
                        }`}>
                          {del.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
