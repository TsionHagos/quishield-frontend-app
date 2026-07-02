'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Registration failed');

      toast.success('Account created! Please login');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
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
          <h2 className="text-3xl font-semibold tracking-tight mb-2">Create account</h2>
          <p className="text-muted-foreground mb-8">Join the fight against quishing</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1.5 text-muted-foreground">Full Name</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-12 rounded-lg bg-background border border-border px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5 text-muted-foreground">Work Email</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-12 rounded-lg bg-background border border-border px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5 text-muted-foreground">Password</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full h-12 rounded-lg bg-background border border-border px-4 focus:outline-none focus:ring-1 focus:ring-primary"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-medium mt-3"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
