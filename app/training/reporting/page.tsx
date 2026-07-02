'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Flag } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function Reporting() {
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
        body: JSON.stringify({ user_id: userId, module_id: 4, completed: true }),
      });
      toast.success('Module 4 marked as complete!');
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
          <div className="text-primary font-semibold tracking-widest text-sm">MODULE 4 / 4</div>
          <h1 className="text-5xl font-bold tracking-tight mt-2">Reporting Suspicious QR Codes</h1>
        </div>
        <div className="text-right"><div className="text-3xl text-muted-foreground">04</div></div>
      </div>

      <div className="h-1 w-full bg-border mt-6 mb-10 rounded"><div className="h-1 w-full bg-primary rounded" /></div>

      <div className="space-y-12 text-lg">
        <section>
          <h2 className="flex items-center gap-3 text-3xl font-semibold mb-4"><Flag className="text-red-400" /> Red Flags in Emails</h2>
          <div className="text-muted-foreground space-y-2">
            <p>• Urgent language (“Your account will be locked”)</p>
            <p>• Unknown or suspicious sender address</p>
            <p>• QR code that doesn’t match the claimed context</p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">How to Report</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="font-semibold mb-3">Internal Reporting</div>
              <p className="text-muted-foreground">Forward suspicious emails to your company’s IT security team immediately.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="font-semibold mb-3">External Reporting</div>
              <p className="text-muted-foreground">Report phishing to authorities such as FTC.gov, CISA, or your local cybercrime unit.</p>
            </div>
          </div>
        </section>

        <div className="text-sm text-muted-foreground mt-8">Reporting helps protect others and improves the security of the entire community.</div>
      </div>

      <div className="mt-12 flex justify-end">
        <button onClick={markComplete} disabled={marking} className="px-10 py-4 rounded-2xl bg-primary text-lg disabled:opacity-60">
          {marking ? 'Marking Complete...' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
}
