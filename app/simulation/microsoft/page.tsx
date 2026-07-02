'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

const getUserIdFromToken = () => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch {
    return null;
  }
};

export default function MicrosoftLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = getUserIdFromToken();

    await fetch(`${API_BASE}/simulation/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId ? parseInt(userId) : null,
        scenario_id: 1,
        qr_id: null,
        visited_page: true,
        entered_credentials: true,
        submitted_data: true,
      }),
    });

    router.push('/caught');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
      <div className="w-full max-w-[440px] bg-white shadow-xl px-10 py-12 rounded border border-[#edebe9]">
        <div className="flex justify-center mb-9">
          <div className="flex items-center gap-2 text-[#1b1b1b]">
            <span className="text-[38px] font-semibold tracking-[-2.2px]">Microsoft</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Sign in</h1>
          <p className="text-sm text-[#605e5c]">Use your Microsoft account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input 
            type="email" 
            placeholder="Email, phone or Skype"
            className="w-full border-b border-[#605e5c] py-3 text-lg focus:outline-none text-[#1b1b1b]" 
            value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full border-b border-[#605e5c] py-3 text-lg focus:outline-none text-[#1b1b1b]" 
            value={form.password} 
            onChange={(e)=>setForm({...form, password:e.target.value})} 
            required 
          />

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-[#0067b8] hover:bg-[#005da8] text-white py-[13px] text-[15px] font-semibold tracking-[0.5px]"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-7 text-xs text-[#605e5c]">This is an educational simulation only. No credentials are stored.</div>
      </div>
    </div>
  );
}
