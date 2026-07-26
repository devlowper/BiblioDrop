import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import api from '../lib/api';
import toast from 'react-hot-toast';

const fieldClass =
  'w-full px-3 py-2.5 bg-brand-ink border border-brand/20 text-black placeholder:text-gray-500 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/dashboard/admin' : user.role === 'librarian' ? '/dashboard/librarian' : '/dashboard/user');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      
      login(res.data.user);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast('Google login not configured in this demo', { icon: 'ℹ️' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 tech-mesh opacity-60 pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
      <Card className="relative max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-black">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-2">Sign in to your account</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              required
              className={fieldClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className={fieldClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button variant="primary" type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand/15" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-brand-panel text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="secondary" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-400">
          Not a member?{' '}
          <Link to="/register" className="font-medium text-brand hover:underline">
            Sign up now
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
