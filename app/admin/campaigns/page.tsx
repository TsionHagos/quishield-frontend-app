'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

interface Campaign {
  id: string;
  name: string;
  status: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', scenario_id: '', start_date: '', end_date: '' });
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  const adminId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : '';

  const fetchData = async () => {
    try {
      const [campRes, scenRes] = await Promise.all([
        fetch(`${API_BASE}/campaigns/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/simulation/scenarios`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const campData = await campRes.json();
      const scenData = await scenRes.json();
      setCampaigns(campData.campaigns || []);
      setScenarios(scenData.scenarios || []);
    } catch {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/campaigns/?admin_id=${adminId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      toast.success('Campaign created');
      setForm({ name: '', scenario_id: '', start_date: '', end_date: '' });
      fetchData();
    } catch {
      toast.error('Failed to create campaign');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE}/campaigns/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch {
      toast.error('Update failed');
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await fetch(`${API_BASE}/campaigns/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-5xl tracking-tight font-bold mb-10">Campaign Management</h1>

      <form onSubmit={createCampaign} className="mb-16 grid gap-4 md:grid-cols-4 bg-card border border-border p-8 rounded-3xl">
        <input type="text" placeholder="Campaign Name" className="bg-background border px-4 py-3 rounded-xl" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <select className="bg-background border px-4 py-3 rounded-xl" value={form.scenario_id} onChange={e => setForm({ ...form, scenario_id: e.target.value })} required>
          <option value="">Select Scenario</option>
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input type="date" className="bg-background border px-4 py-3 rounded-xl" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} required />
        <input type="date" className="bg-background border px-4 py-3 rounded-xl" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required />
        <button type="submit" className="md:col-span-4 py-3.5 bg-primary rounded-2xl font-medium tracking-wider text-sm">Create Campaign</button>
      </form>

      <div className="space-y-4">
        {loading ? <div>Loading...</div> : campaigns.map(camp => (
          <div key={camp.id} className="flex items-center justify-between rounded-2xl border border-border bg-card px-8 py-6">
            <div>
              <div className="font-semibold text-xl">{camp.name}</div>
              <div className="text-muted-foreground text-sm">{camp.id}</div>
            </div>
            <div className="flex items-center gap-3">
              <select value={camp.status} onChange={e => updateStatus(camp.id, e.target.value)} className="bg-background border px-4 py-2 rounded-xl">
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="completed">completed</option>
              </select>
              <button onClick={() => deleteCampaign(camp.id)} className="text-red-400 px-4">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
