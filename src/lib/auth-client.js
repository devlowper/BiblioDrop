import { createAuthClient } from 'better-auth/react';

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const authClient = createAuthClient({
  baseURL: apiBase.endsWith('/auth') ? apiBase : `${apiBase}/auth`,
});

export const { signIn, signUp, signOut, useSession } = authClient;
