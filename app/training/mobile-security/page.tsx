'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Key } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function MobileSecurity() {
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, module_id: 3, completed: true }),
      });
      toast.success('Module 3 marked as complete!');
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
          <div className="text-primary font-semibold tracking-widest text-sm">MODULE 3 / 4</div>
          <h1 className="text-5xl font-bold tracking-tight mt-2">Mobile Security</h1>
        </div>
        <div className="text-right"><div className="text-3xl text-muted-foreground">03</div></div>
      </div>

      <div className="h-1 w-full bg-border mt-6 mb-10 rounded"><div className="h-1 w-3/4 bg-primary rounded" /></div>

      <div className="space-y-12 text-lg">
        <section>
          <h2 className="flex items-center gap-3 text-3xl font-semibold mb-4"><Smartphone className="text-primary" /> Basic Phone Hardening</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li>• Keep your phone’s operating system updated</li>
            <li>• Avoid installing apps from unknown sources</li>
            <li>• Install reputable Mobile Threat Defense (MTD) software</li>
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-3 text-3xl font-semibold mb-4"><Key className="text-primary" /> Replace Passwords</h2>
          <p className="text-muted-foreground mb-4">Use FIDO2 / Passkeys instead of traditional passwords. They are much more resistant to phishing.</p>
          <div className="rounded-2xl border border-border bg-card p-6">Passkeys are phishing-resistant and don’t require typing a password on untrusted sites.</div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Public WiFi & QR Codes</h2>
          <p className="text-muted-foreground">Use a VPN when connecting to public WiFi. Be extra cautious with QR codes found in public places (restaurants, parking lots, airports).</p>
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
