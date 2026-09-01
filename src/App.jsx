import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import PageTransition from './components/PageTransition';

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-brand-void text-black font-sans selection:bg-brand selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/browse" element={<PageTransition><Browse /></PageTransition>} />
            <Route path="/books/:id" element={<PageTransition><BookDetails /></PageTransition>} />
            <Route path="/authors/:authorName" element={<PageTransition><AuthorDetails /></PageTransition>} />
            <Route path="/blog/:id" element={<PageTransition><BlogDetails /></PageTransition>} />
            <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
            <Route path="/track/:orderId" element={<PageTransition><TrackOrder /></PageTransition>} />

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard/user" element={<PageTransition><UserDashboard /></PageTransition>} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['librarian', 'admin']} />}>
              <Route path="/dashboard/librarian" element={<PageTransition><LibrarianDashboard /></PageTransition>} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
            </Route>

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
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
