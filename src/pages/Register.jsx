import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import api from '../lib/api';
import toast from 'react-hot-toast';

const fieldClass =
  'w-full px-3 py-2.5 bg-brand-ink border border-brand/20 text-black placeholder:text-gray-500 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadToImgbb = async (file) => {
    const data = new FormData();
    data.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
      method: 'POST',
      body: data
    });
    const result = await res.json();
    return result.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match");
    }

    setLoading(true);
    try {
      let photoURL = '';
      if (photo) {
        photoURL = await uploadToImgbb(photo);
      }

      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        photoURL
      });
      const newUser = res.data.user;

      login(newUser);
      toast.success('Registration successful');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 tech-mesh opacity-60 pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />
      <Card className="relative max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-black">Create an account</h2>
          <p className="text-sm text-gray-400 mt-2">Join BiblioDrop today</p>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" required
              className={fieldClass}
              onChange={handleInputChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input type="email" name="email" required
              className={fieldClass}
              onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" required
                className={fieldClass}
                onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
              <input type="password" name="confirmPassword" required
                className={fieldClass}
                onChange={handleInputChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo (Optional)</label>
            <input type="file" accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-brand-deep"
              onChange={(e) => setPhoto(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleInputChange} className="accent-brand" />
                <span className="text-sm text-gray-600">Reader</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="librarian" checked={formData.role === 'librarian'} onChange={handleInputChange} className="accent-brand" />
                <span className="text-sm text-gray-600">Librarian / Owner</span>
              </label>
            </div>
          </div>

          <Button variant="primary" type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
