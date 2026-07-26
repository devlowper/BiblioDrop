import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Card from '../components/ui/Card';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stats/admin'); 
      setStats(res.data.data);
    } catch (error) {
      toast.error('Failed to load admin statistics');
      setStats({
        totalUsers: 150,
        totalBooks: 320,
        totalDeliveries: 45,
        categoryStats: [
          { name: 'Fiction', value: 400 },
          { name: 'Non-Fiction', value: 300 },
          { name: 'Science', value: 300 },
          { name: 'History', value: 200 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const COLORS = ['#FF7B6B', '#E85A4A', '#FF9A8E', '#F5D4D0', '#8F6A66'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-black mb-8">Admin Dashboard</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SkeletonLoader className="h-32" />
          <SkeletonLoader className="h-32" />
          <SkeletonLoader className="h-32" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 flex flex-col justify-center items-center">
              <h3 className="text-sm font-mono font-medium text-gray-400 uppercase tracking-wide">Total Users</h3>
              <p className="text-4xl font-bold mt-2 text-black">{stats.totalUsers}</p>
            </Card>
            <Card className="p-6 flex flex-col justify-center items-center">
              <h3 className="text-sm font-mono font-medium text-gray-400 uppercase tracking-wide">Total Books</h3>
              <p className="text-4xl font-bold mt-2 text-black">{stats.totalBooks}</p>
            </Card>
            <Card className="p-6 flex flex-col justify-center items-center">
              <h3 className="text-sm font-mono font-medium text-gray-400 uppercase tracking-wide">Total Deliveries</h3>
              <p className="text-4xl font-bold mt-2 text-black">{stats.totalDeliveries}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="font-display text-2xl font-semibold text-black mb-6">Books by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(255,123,107,0.3)', borderRadius: '4px', color: '#1f1416' }}
                    itemStyle={{ color: '#1f1416' }}
                  />
                  <Legend wrapperStyle={{ color: '#8f6a66' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
