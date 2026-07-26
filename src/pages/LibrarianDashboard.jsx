import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BookOpen, DollarSign, Clock, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const fieldClass =
  'w-full p-2.5 bg-brand-ink border border-brand/20 text-black placeholder:text-gray-500 rounded-sm text-sm focus:ring-1 focus:ring-brand focus:border-brand focus:outline-none';

const LibrarianDashboard = () => {
  const { user } = useAuth();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', description: '', category: 'Fiction', deliveryFee: '' });
  const [cover, setCover] = useState(null);
  const [coverUrl, setCoverUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['librarianStats', user.email],
    queryFn: async () => {
      const res = await api.get(`/stats/librarian-stats/${user.email}`);
      return res.data.data;
    }
  });

  const { data: inventory, isLoading: invLoading, refetch: refetchInv } = useQuery({
    queryKey: ['librarianInventory', user.email],
    queryFn: async () => {
      const res = await api.get(`/books/librarian/${user.email}`);
      return res.data.data;
    }
  });

  const { data: deliveries, isLoading: delLoading, refetch: refetchDel } = useQuery({
    queryKey: ['librarianDeliveries', user.email],
    queryFn: async () => {
      const res = await api.get(`/deliveries/librarian/${user.email}`);
      return res.data.data;
    }
  });

  const uploadToImgbb = async (file) => {
    const data = new FormData();
    data.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, { method: 'POST', body: data });
    const result = await res.json();
    return result.data.url;
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let coverImage = coverUrl;
      if (cover) coverImage = await uploadToImgbb(cover);
      
      await api.post('/books', { ...formData, deliveryFee: Number(formData.deliveryFee), coverImage });
      
      toast.success('Book submitted for approval!');
      setShowAddForm(false);
      setFormData({ title: '', author: '', description: '', category: 'Fiction', deliveryFee: '' });
      setCover(null);
      setCoverUrl('');
      refetchInv();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleBooksSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsSearching(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&key=${apiKey}&maxResults=5`);
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (error) {
      toast.error('Failed to search Google Books');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = (book) => {
    const volumeInfo = book.volumeInfo;
    setFormData({
      ...formData,
      title: volumeInfo.title || '',
      author: volumeInfo.authors ? volumeInfo.authors.join(', ') : '',
      description: volumeInfo.description || '',
    });
    
    if (volumeInfo.imageLinks?.thumbnail) {
      setCoverUrl(volumeInfo.imageLinks.thumbnail.replace('http:', 'https:'));
    }
    
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleTogglePublish = async (bookId, currentStatus) => {
    if (currentStatus === 'pending_approval') {
      return toast.error("Cannot publish until approved by admin.");
    }
    
    try {
      if (currentStatus === 'published') {
        await api.patch(`/books/${bookId}`, { status: 'unpublished' });
      } else {
        await api.patch(`/books/${bookId}/publish`);
      }
      toast.success('Book status updated');
      refetchInv();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${bookId}`);
        toast.success('Book deleted');
        refetchInv();
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleUpdateDelivery = async (delId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'pending' ? 'dispatched' : 'delivered';
      await api.patch(`/deliveries/${delId}/status`, { status: nextStatus });
      toast.success(`Delivery marked as ${nextStatus}`);
      refetchDel();
    } catch (error) {
      toast.error('Failed to update delivery');
    }
  };

  if (statsLoading || invLoading || delLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px-300px)]">
      <aside className="w-full md:w-64 bg-brand-panel border-r border-brand/15 p-6 shrink-0">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-deep rounded-full overflow-hidden border border-brand/30">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
            ) : <div className="w-full h-full bg-brand-deep"></div>}
          </div>
          <div>
            <h2 className="font-bold text-sm text-black">{user.name}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-mono">Librarian</p>
          </div>
        </div>
        <nav className="space-y-2">
          <a href="#overview" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-brand-ink hover:text-brand transition-colors">Overview</a>
          <a href="#inventory" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-brand-ink hover:text-brand transition-colors">Manage Inventory</a>
          <a href="#deliveries" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-brand-ink hover:text-brand transition-colors">Manage Deliveries</a>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10 max-w-[100vw]">
        <h1 className="font-display text-3xl font-bold tracking-tight text-black mb-8" id="overview">Librarian Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-brand/10 border border-brand/20 text-brand"><BookOpen className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-mono">Total Books</p>
              <p className="text-2xl font-bold text-black">{stats.totalBooks}</p>
            </div>
          </Card>
          <Card className="p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-brand/10 border border-brand/20 text-brand"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-mono">Total Earnings</p>
              <p className="text-2xl font-bold text-black">${stats.totalEarnings.toFixed(2)}</p>
            </div>
          </Card>
          <Card className="p-6 flex flex-row items-center gap-4">
            <div className="p-3 bg-brand/10 border border-brand/20 text-brand"><Clock className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-mono">Pending Req.</p>
              <p className="text-2xl font-bold text-black">{stats.activePendingRequests}</p>
            </div>
          </Card>
        </div>

        <div className="mb-10" id="inventory">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-bold tracking-tight text-black">Inventory</h2>
            <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Book
            </Button>
          </div>

          {showAddForm && (
            <Card className="p-6 mb-8">
              <div className="mb-6 pb-6 border-b border-brand/15">
                <h3 className="font-bold mb-4 text-brand font-mono text-sm uppercase tracking-wider">Auto-fill with Google Books (Optional)</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Search by Title or ISBN..." 
                    className={`flex-1 ${fieldClass}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGoogleBooksSearch(e)}
                  />
                  <Button variant="secondary" onClick={handleGoogleBooksSearch} disabled={isSearching}>
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="mt-4 border border-brand/15 bg-brand-ink overflow-hidden">
                    {searchResults.map((book) => (
                      <div 
                        key={book.id} 
                        className="p-3 border-b border-brand/10 last:border-0 hover:bg-brand/5 cursor-pointer flex gap-4"
                        onClick={() => handleSelectBook(book)}
                      >
                        {book.volumeInfo.imageLinks?.smallThumbnail && (
                          <img src={book.volumeInfo.imageLinks.smallThumbnail.replace('http:', 'https:')} alt="cover" className="w-10 h-14 object-cover" />
                        )}
                        <div>
                          <p className="font-bold text-sm text-black line-clamp-1">{book.volumeInfo.title}</p>
                          <p className="text-xs text-gray-400">{book.volumeInfo.authors?.join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <h3 className="font-bold text-black mb-4">List a New Book</h3>
              <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <input required placeholder="Title" value={formData.title} className={fieldClass} onChange={(e)=>setFormData({...formData, title: e.target.value})} />
                  <input required placeholder="Author" value={formData.author} className={fieldClass} onChange={(e)=>setFormData({...formData, author: e.target.value})} />
                  <div className="flex gap-4">
                    <select className={`flex-1 ${fieldClass}`} value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                      <option>Fiction</option><option>Non-Fiction</option><option>Science Fiction</option><option>Biography</option><option>Children</option>
                    </select>
                    <input required type="number" min="0" step="0.01" value={formData.deliveryFee} placeholder="Fee ($)" className={`w-32 ${fieldClass}`} onChange={(e)=>setFormData({...formData, deliveryFee: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-4">
                  <textarea placeholder="Description" rows="3" value={formData.description} className={fieldClass} onChange={(e)=>setFormData({...formData, description: e.target.value})} />
                  <div className="flex items-center gap-4">
                    {coverUrl && !cover && (
                       <img src={coverUrl} alt="Cover Preview" className="w-12 h-16 object-cover border border-brand/15" />
                    )}
                    <input type="file" accept="image/*" className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:bg-brand file:text-white file:border-none" onChange={(e) => setCover(e.target.files[0])} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Book'}</Button>
                  <p className="text-xs text-gray-400 mt-2">New books start as "Pending Approval" until an admin reviews them.</p>
                </div>
              </form>
            </Card>
          )}

          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-ink border-b border-brand/15">
                <tr>
                  <th className="p-4 font-medium text-gray-400">Book</th>
                  <th className="p-4 font-medium text-gray-400">Status</th>
                  <th className="p-4 font-medium text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand/10">
                {inventory?.length === 0 ? <tr><td colSpan="3" className="p-4 text-center text-gray-400">No books in inventory.</td></tr> : null}
                {inventory?.map(book => (
                  <tr key={book._id} className="hover:bg-brand-ink">
                    <td className="p-4 font-medium text-black">{book.title}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider font-mono ${book.status === 'published' ? 'bg-brand-deep text-white' : 'bg-brand-ink text-gray-700 border border-brand/15'}`}>
                        {book.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button 
                        variant={book.status === 'published' ? 'outline' : 'primary'} 
                        className="text-xs px-2 py-1"
                        disabled={book.status === 'pending_approval'}
                        onClick={() => handleTogglePublish(book._id, book.status)}
                      >
                        {book.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button variant="outline" className="text-xs px-2 py-1" onClick={() => handleDeleteBook(book._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div id="deliveries">
          <h2 className="font-display text-2xl font-bold tracking-tight text-black mb-6">Manage Deliveries</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-ink border-b border-brand/15">
                <tr>
                  <th className="p-4 font-medium text-gray-400">Date</th>
                  <th className="p-4 font-medium text-gray-400">Client</th>
                  <th className="p-4 font-medium text-gray-400">Book</th>
                  <th className="p-4 font-medium text-gray-400">Status</th>
                  <th className="p-4 font-medium text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand/10">
                {deliveries?.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-400">No delivery requests yet.</td></tr> : null}
                {deliveries?.map(del => (
                  <tr key={del._id} className="hover:bg-brand-ink">
                    <td className="p-4 text-gray-400">{new Date(del.requestDate).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-600">{del.userEmail}</td>
                    <td className="p-4 font-medium text-black">{del.bookTitle}</td>
                    <td className="p-4">
                       <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider font-mono bg-brand-ink text-gray-700 border border-brand/15">{del.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      {del.status !== 'delivered' && (
                        <Button variant="primary" className="text-xs px-2 py-1" onClick={() => handleUpdateDelivery(del._id, del.status)}>
                          Mark {del.status === 'pending' ? 'Dispatched' : 'Delivered'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LibrarianDashboard;
