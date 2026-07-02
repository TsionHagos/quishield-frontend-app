'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setReports(data.reports || []);
    } catch {
      toast.error('Failed to load reports');
    }
  };

  const fetchCampaigns = async () => {
    const res = await fetch(`${API_BASE}/campaigns/`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setCampaigns(data.campaigns || []);
  };

  const generateReport = async () => {
    if (!selectedCampaign) return;
    try {
      await fetch(`${API_BASE}/reports/generate/${selectedCampaign}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Report generated');
      fetchReports();
    } catch {
      toast.error('Generation failed');
    }
  };

  const downloadReport = (reportId: string) => {
    window.open(`${API_BASE}/reports/download/${reportId}`, '_blank');
  };

  useEffect(() => {
    fetchReports();
    fetchCampaigns();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold tracking-tight mb-10">Reports</h1>

      <div className="mb-12 flex gap-4">
        <select className="flex-1 border bg-card px-5 py-4 rounded-2xl" value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}>
          <option value="">Select Campaign</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={generateReport} className="px-10 bg-primary rounded-2xl font-semibold">Generate Report</button>
      </div>

      <div className="space-y-3">
        {reports.length > 0 ? reports.map(report => (
          <div key={report.id} className="flex items-center justify-between border border-border bg-card px-8 py-6 rounded-2xl">
            <div>{report.name} • Generated {new Date(report.created_at).toLocaleDateString()}</div>
            <button onClick={() => downloadReport(report.id)} className="text-primary">Download</button>
          </div>
        )) : <div className="text-muted-foreground">No reports yet.</div>}
      </div>
    </div>
  );
}
