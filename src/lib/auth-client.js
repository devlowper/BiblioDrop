import { createAuthClient } from 'better-auth/react';

const isProd = import.meta.env.PROD;
const apiBase = (isProd ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')).replace(/\/$/, '');

export const authClient = createAuthClient({
  baseURL: apiBase.endsWith('/auth') ? apiBase : `${apiBase}/auth`,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
