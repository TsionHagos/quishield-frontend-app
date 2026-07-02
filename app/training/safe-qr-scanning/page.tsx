'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function SafeQRScanning() {
  const [marking, setMarking] = useState(false);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') : null;

  const markComplete = async () => {
    if (!userId || !token) return;

    setMarking(true);
    try {
      await fetch(`${API_BASE}/awareness/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, module_id: 2, completed: true }),
      });
      toast.success('Module 2 marked as complete!');
      router.push('/dashboard/training');
    } catch {
      toast.error('Failed to mark complete');
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button onClick={() => router.push('/dashboard/training')} className="flex items-center gap-2 text-sm mb-8 hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> Back to Training
      </button>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-primary font-semibold tracking-widest text-sm">MODULE 2 / 4</div>
          <h1 className="text-5xl font-bold tracking-tight mt-2">Safe QR Scanning</h1>
        </div>
        <div className="text-right"><div className="text-3xl text-muted-foreground">02</div></div>
      </div>

      <div className="h-1 w-full bg-border mt-6 mb-10 rounded"><div className="h-1 w-2/4 bg-primary rounded" /></div>

      <div className="space-y-12 text-lg">
        <section>
          <h2 className="flex items-center gap-3 text-3xl font-semibold mb-4"><CheckCircle className="text-emerald-400" /> Always Preview the URL</h2>
          <p className="text-muted-foreground">Many modern phones show the destination URL before you open it. Always read it carefully before tapping.</p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Security Checklist Before Opening</h2>
          <div className="space-y-6">
            {[
              'Check that the domain name is correct and legitimate',
              'Verify the site uses HTTPS (lock icon)',
              'Be suspicious of unusual domains like microsoft-login-secure.com',
              'Use a QR code scanner that shows the URL first',
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="text-emerald-400 mt-1"><ShieldCheck /></div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Never Scan QR Codes From Unknown Sources</h2>
          <p className="text-muted-foreground">Avoid scanning random codes you see in emails, flyers, or stickers in public places unless you know exactly where they came from.</p>
        </section>
      </div>

      <div className="mt-12 flex justify-end">
        <button onClick={markComplete} disabled={marking} className="px-10 py-4 rounded-2xl bg-primary text-lg disabled:opacity-60">
          {marking ? 'Marking Complete...' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
}
