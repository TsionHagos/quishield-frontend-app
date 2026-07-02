'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();

      // Fetch user info to get user_id, name, and role
      const profileRes = await fetch(`${API_BASE}/auth/users`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const users = await profileRes.json();
      const currentUser = users.find((u: any) => u.email === email);

      if (currentUser) {
        sessionStorage.setItem('userId', String(currentUser.user_id));
        sessionStorage.setItem('userName', currentUser.name);
        sessionStorage.setItem('userRole', currentUser.role);
        sessionStorage.setItem('token', data.access_token);
      } else {
        // Fallback if user not found in list
        sessionStorage.setItem('token', data.access_token);
      }

      const role = currentUser?.role || 'user';

      toast.success('Logged in successfully');

      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-9 h-9 text-primary" />
            <span className="text-3xl font-semibold tracking-tight">QuisShield</span>
          </div>
        </div>
        
        <div className="rounded-2xl border border-border p-8 bg-card">
          <h2 className="text-3xl font-semibold tracking-tight mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to continue your training</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-1.5 text-muted-foreground">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg bg-background border border-border px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5 text-muted-foreground">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-lg bg-background border border-border px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-medium mt-3"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
