'use client';

import { useState } from 'react';
import { toast } from 'sonner';

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

export default function VerifySimulator() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  const userId = typeof window !== 'undefined' ? getUserIdFromToken() : null;

  const checkSimulator = async () => {
    if (!url) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/adaptive/verify-simulator?url=${encodeURIComponent(url)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error('Failed to analyze URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold tracking-tight mb-4">QR Verification Simulator</h1>
      <p className="text-muted-foreground mb-8">Paste a URL to see its threat indicators</p>

      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 border border-border bg-card px-5 py-4 rounded-2xl text-lg"
        />
        <button onClick={checkSimulator} disabled={loading} className="px-10 rounded-2xl bg-primary font-medium">
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {result && (
        <div className="mt-12 border border-border bg-card p-8 rounded-3xl">
          <div className="font-semibold mb-6 text-xl">Threat Indicators</div>
          <div className="space-y-3 text-sm">
            {result.threat_indicators?.map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-red-400">•</span> {item}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t text-muted-foreground text-sm">
            {result.overall_risk || 'Analysis complete.'}
          </div>
        </div>
      )}
    </div>
  );
}
