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

export default function PackageDelivery() {
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getUserIdFromToken();

    await fetch(`${API_BASE}/simulation/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId ? parseInt(userId) : null,
        scenario_id: 3,
        qr_id: null,
        visited_page: true,
        entered_credentials: true,
        submitted_data: true,
      }),
    });
    router.push('/caught');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <div className="text-orange-600 font-bold tracking-[4px] text-sm mb-1">DHL EXPRESS</div>
          <span className="text-5xl font-semibold tracking-[-1.5px]">Package Delivery</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border p-9 space-y-5 text-sm">
          <div>Delivery Attempt #A39281 — Reschedule or pickup</div>
          <input type="text" placeholder="Full Name" required className="w-full py-3.5 border px-4" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input type="text" placeholder="Delivery Address" required className="w-full py-3.5 border px-4" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
          <input type="tel" placeholder="Mobile number" required className="w-full py-3.5 border px-4" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <button className="bg-orange-600 text-white font-semibold w-full py-4 mt-4 tracking-wider">CONFIRM DELIVERY SLOT</button>
        </form>
        
        <div className="text-center mt-5 text-xs text-gray-500">Educational simulation only</div>
      </div>
    </div>
  );
}
