'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const clickRate = stats?.total_users
    ? ((stats.phishing_page_visits || 0) / stats.total_users * 100).toFixed(1) + '%'
    : '—';

  const credentialRate = stats?.total_users
    ? ((stats.credential_entries || 0) / stats.total_users * 100).toFixed(1) + '%'
    : '—';

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold tracking-tight mb-10">Admin Dashboard</h1>

      {loading ? <div>Loading analytics...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Total Scans', value: stats?.total_scans },
            { label: 'Phishing Visits', value: stats?.phishing_page_visits },
            { label: 'Credential Entries', value: stats?.credential_entries },
            { label: 'Training Completions', value: stats?.completed_training_sessions },
            { label: 'Average Quiz Score', value: stats?.average_quiz_score },
          ].map((stat, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-8">
              <div className="text-muted-foreground text-sm tracking-widest">{stat.label}</div>
              <div className="text-7xl mt-6 tracking-tighter font-semibold">{stat.value ?? '—'}</div>
            </div>
          ))}

          {/* New calculated rates */}
          <div className="rounded-3xl border border-yellow-500/50 bg-yellow-500/5 p-8">
            <div className="text-yellow-400 text-sm tracking-widest">Click Rate</div>
            <div className="text-7xl mt-6 tracking-tighter font-semibold text-yellow-400">{clickRate}</div>
          </div>

          <div className="rounded-3xl border border-red-500/50 bg-red-500/5 p-8">
            <div className="text-red-400 text-sm tracking-widest">Credential Submission Rate</div>
            <div className="text-7xl mt-6 tracking-tighter font-semibold text-red-400">{credentialRate}</div>
          </div>
        </div>
      )}
    </div>
  );
}
