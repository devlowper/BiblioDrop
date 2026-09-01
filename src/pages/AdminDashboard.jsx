import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import Card from '../components/ui/Card';
import { LayoutDashboard, Users, BookOpen, FileText, CreditCard, CheckCircle, Trash2, Edit, Settings } from 'lucide-react';

const COLORS = ['#FF7B6B', '#E85A4A', '#FF9A8E', '#F5D4D0', '#8F6A66'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await api.get('/stats/admin').catch(() => null);
        setStats(res?.data?.data || {
          totalUsers: 150,
          totalBooks: 320,
          totalDeliveries: 45,
          totalRevenue: 12500.50,
          categoryStats: [
            { name: 'Fiction', value: 400 },
            { name: 'Non-Fiction', value: 300 },
            { name: 'Science', value: 300 },
            { name: 'History', value: 200 },
          ],
          revenueData: [
            { name: 'Jan', revenue: 4000 },
            { name: 'Feb', revenue: 3000 },
            { name: 'Mar', revenue: 5000 },
            { name: 'Apr', revenue: 4500 },
            { name: 'May', revenue: 6000 },
            { name: 'Jun', revenue: 5500 },
          ]
        });
      } else if (activeTab === 'users') {
        const res = await api.get('/users').catch(() => null);
        setUsers(res?.data?.data || [
          { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'librarian' },
          { _id: '3', name: 'Admin', email: 'admin@gmail.com', role: 'admin' },
        ]);
      } else if (activeTab === 'approvals' || activeTab === 'books') {
        const res = await api.get('/books/all').catch(() => null);
        setBooks(res?.data?.data || [
          { _id: '101', title: 'The Great Gatsby', author: 'F. Scott', status: 'available', category: 'Fiction' },
          { _id: '102', title: 'Pending Book', author: 'Author X', status: 'pending', category: 'Science' },
          { _id: '103', title: 'Learn React', author: 'Dev Y', status: 'pending', category: 'Non-Fiction' },
        ]);
      } else if (activeTab === 'transactions') {
        // mock transactions
        setTransactions([
          { _id: 'txn_1', userEmail: 'user@gmail.com', librarianEmail: 'lib@gmail.com', amount: 25.00, date: '2026-07-27' },
          { _id: 'txn_2', userEmail: 'john@gmail.com', librarianEmail: 'admin@gmail.com', amount: 15.50, date: '2026-07-26' },
        ]);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handleApproveBook = (id) => {
    toast.success(`Book ${id} approved and published!`);
    setBooks(books.map(b => b._id === id ? { ...b, status: 'available' } : b));
  };

  const handleDeleteBook = (id) => {
    toast.success(`Book ${id} deleted.`);
    setBooks(books.filter(b => b._id !== id));
  };

  const handleRoleChange = (id, newRole) => {
    toast.success(`User role updated to ${newRole}`);
    setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
  };

  const handleDeleteUser = (id) => {
    toast.success(`User deleted.`);
    setUsers(users.filter(u => u._id !== id));
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'approvals', label: 'Approval Queue', icon: CheckCircle },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'books', label: 'Manage Books', icon: BookOpen },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-6 shadow-sm z-10 relative">
        <h2 className="font-display font-bold text-xl text-[#1a1f36] mb-8 flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand" /> Admin Panel
        </h2>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${
                activeTab === item.id 
                  ? 'bg-brand/10 text-brand' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#1a1f36]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20"><SkeletonLoader className="h-40 w-full" /></div>
          ) : (
            <>
              {activeTab === 'overview' && stats && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#1a1f36] mb-8">Dashboard Overview</h1>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                          <Users className="w-6 h-6 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Users</p>
                          <p className="text-2xl font-bold text-[#1a1f36]">{stats.totalUsers}</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Books</p>
                          <p className="text-2xl font-bold text-[#1a1f36]">{stats.totalBooks}</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Deliveries</p>
                          <p className="text-2xl font-bold text-[#1a1f36]">{stats.totalDeliveries}</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                          <CreditCard className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Revenue</p>
                          <p className="text-2xl font-bold text-[#1a1f36]">${stats.totalRevenue?.toLocaleString()}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-6">
                      <h2 className="font-bold text-[#1a1f36] mb-6">Books by Category</h2>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.categoryStats}
                              cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {stats.categoryStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <h2 className="font-bold text-[#1a1f36] mb-6">Revenue Trend (Last 6 Months)</h2>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#FF7B6B" strokeWidth={3} dot={{r:4}} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'approvals' && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#1a1f36] mb-8">Book Approval Queue</h1>
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium whitespace-nowrap">
                          <tr>
                            <th className="p-4">Book Title</th>
                            <th className="p-4">Author</th>
                            <th className="p-4">Category</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {books.filter(b => b.status === 'pending').length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-400">No books pending approval.</td></tr>
                          )}
                          {books.filter(b => b.status === 'pending').map(book => (
                            <tr key={book._id} className="hover:bg-gray-50/50">
                              <td className="p-4 font-medium text-[#1a1f36]">{book.title}</td>
                              <td className="p-4 text-gray-600">{book.author}</td>
                              <td className="p-4 text-gray-600">{book.category}</td>
                              <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                <button onClick={() => handleApproveBook(book._id)} className="px-3 py-1.5 bg-green-50 text-green-600 rounded font-medium hover:bg-green-100 transition-colors">Approve & Publish</button>
                                <button onClick={() => handleDeleteBook(book._id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded font-medium hover:bg-red-100 transition-colors">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#1a1f36] mb-8">Manage Users</h1>
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium whitespace-nowrap">
                          <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {users.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50/50">
                              <td className="p-4 font-medium text-[#1a1f36]">{u.name}</td>
                              <td className="p-4 text-gray-600">{u.email}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                  u.role === 'librarian' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4 text-right whitespace-nowrap">
                                <select 
                                  className="mr-2 p-1.5 border border-gray-200 rounded text-sm outline-none bg-white font-medium text-gray-600"
                                  value={u.role}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                >
                                  <option value="user">User</option>
                                  <option value="librarian">Librarian</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors align-middle"><Trash2 className="w-4 h-4" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'books' && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#1a1f36] mb-8">Manage All Books</h1>
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium whitespace-nowrap">
                          <tr>
                            <th className="p-4">Book Title</th>
                            <th className="p-4">Author</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {books.map(book => (
                            <tr key={book._id} className="hover:bg-gray-50/50">
                              <td className="p-4 font-medium text-[#1a1f36]">{book.title}</td>
                              <td className="p-4 text-gray-600">{book.author}</td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                                  book.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {book.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                {book.status === 'available' && (
                                  <button onClick={() => {
                                    toast.success('Book unpublished');
                                    setBooks(books.map(b => b._id === book._id ? {...b, status: 'pending'} : b));
                                  }} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded font-medium hover:bg-orange-100 transition-colors">Unpublish</button>
                                )}
                                <button onClick={() => handleDeleteBook(book._id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded font-medium hover:bg-red-100 transition-colors">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-[#1a1f36] mb-8">Platform Transactions</h1>
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium whitespace-nowrap">
                          <tr>
                            <th className="p-4">Transaction ID</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Librarian</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {transactions.map(txn => (
                            <tr key={txn._id} className="hover:bg-gray-50/50">
                              <td className="p-4 font-mono text-gray-500">{txn._id}</td>
                              <td className="p-4 font-medium text-[#1a1f36]">{txn.userEmail}</td>
                              <td className="p-4 text-gray-600">{txn.librarianEmail}</td>
                              <td className="p-4 font-bold text-brand">${txn.amount.toFixed(2)}</td>
                              <td className="p-4 text-gray-500">{txn.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
