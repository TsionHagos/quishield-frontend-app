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

export default function ScholarshipPage() {
  const [form, setForm] = useState({ name: '', studentId: '', email: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserIdFromToken();

    await fetch(`${API_BASE}/simulation/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId ? parseInt(userId) : null,
        scenario_id: 2,
        qr_id: null,
        visited_page: true,
        entered_credentials: true,
        submitted_data: true,
      }),
    });
    router.push('/caught');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tighter">Global Scholarship Fund</h1>
          <p className="text-lg mt-2 text-gray-600">Awarded based on urgent need — Apply before slots close</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required className="w-full border border-gray-300 py-4 px-4 rounded" />
          <input type="text" placeholder="Student ID" value={form.studentId} onChange={e => setForm({...form,studentId:e.target.value})} required className="w-full border border-gray-300 py-4 px-4 rounded" />
          <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required className="w-full border border-gray-300 py-4 px-4 rounded" />
          
          <button type="submit" className="w-full bg-blue-600 text-white py-4 font-semibold tracking-wider">SUBMIT APPLICATION</button>
        </form>
        <p className="text-xs text-center text-gray-500 mt-4">For demo only • QuisShield Awareness Training</p>
      </div>
    </div>
  );
}
