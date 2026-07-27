import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import UserDashboard from './pages/UserDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthorDetails from './pages/AuthorDetails';
import BlogDetails from './pages/BlogDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-void text-black font-sans selection:bg-brand selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/authors/:authorName" element={<AuthorDetails />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track/:orderId" element={<TrackOrder />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard/user" element={<UserDashboard />} />
          </Route>
          
          <Route element={<PrivateRoute allowedRoles={['librarian', 'admin']} />}>
            <Route path="/dashboard/librarian" element={<LibrarianDashboard />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#FFFFFF',
          color: '#1f1416',
          border: '1px solid rgba(255, 123, 107, 0.35)',
          borderRadius: '4px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        }
      }} />
    </div>
  );
}

export default App;
