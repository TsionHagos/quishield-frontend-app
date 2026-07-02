'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function QRGenerator() {
  const [form, setForm] = useState({ qr_type: 'awareness', destination_url: '', campaign_id: '' });
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

  const generateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/qr/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          destination_url: form.destination_url,
          qr_type: form.qr_type,
          campaign_id: form.campaign_id || null,
        }),
      });
      const data = await res.json();
      setImageBase64(data.image_base64 || '');
      toast.success('QR code generated');
    } catch {
      toast.error('QR generation failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!imageBase64) return;

    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = 'quishield-qr.png';
    link.click();
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold tracking-tight mb-8">QR Code Generator</h1>

      <form onSubmit={generateQR} className="space-y-4 border border-border bg-card p-8 rounded-3xl">
        <select value={form.qr_type} onChange={e => setForm({ ...form, qr_type: e.target.value })} className="w-full bg-background border px-4 py-4 rounded-2xl">
          <option value="awareness">Awareness</option>
          <option value="phishing">Phishing</option>
          <option value="login">Login</option>
          <option value="payment">Payment</option>
        </select>
        <input type="url" placeholder="Destination URL" className="w-full border px-5 py-4 rounded-2xl" value={form.destination_url} onChange={e => setForm({ ...form, destination_url: e.target.value })} required />
        <input placeholder="Campaign ID (optional)" className="w-full border px-5 py-4 rounded-2xl" value={form.campaign_id} onChange={e => setForm({ ...form, campaign_id: e.target.value })} />

        <button type="submit" className="w-full py-4 bg-primary rounded-2xl font-medium" disabled={loading}>
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
      </form>

      {imageBase64 && (
        <div className="mt-12 text-center">
          <img 
            src={`data:image/png;base64,${imageBase64}`} 
            alt="QR Code" 
            className="inline-block bg-white p-4 rounded-2xl max-w-[280px]" 
          />
          <div className="mt-8">
            <button 
              onClick={downloadQR} 
              className="px-10 py-4 bg-secondary rounded-2xl font-medium"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
