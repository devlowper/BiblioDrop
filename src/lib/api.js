import axios from 'axios';

import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Don't toast on 401/403 automatically if we want silent auth checks, 
    // but for user actions, it's good. We can refine if needed.
    if (error.response?.status !== 401) {
       toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
