'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = 'https://clever-grace-production-a283.up.railway.app';

export default function RecognizingQuishing() {
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
        body: JSON.stringify({
          user_id: userId,
          module_id: 1,
          completed: true,
        }),
      });
      toast.success('Module 1 marked as complete!');
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
          <div className="text-primary font-semibold tracking-widest text-sm">MODULE 1 / 4</div>
          <h1 className="text-5xl font-bold tracking-tight mt-2">Recognizing Quishing</h1>
        </div>
        <div className="text-right">
          <div className="text-3xl text-muted-foreground">01</div>
        </div>
      </div>

      <div className="h-1 w-full bg-border mt-6 mb-10 rounded">
        <div className="h-1 w-1/4 bg-primary rounded" />
      </div>

      {/* Content Sections */}
      <div className="space-y-12 text-lg">
        <section>
          <h2 className="flex items-center gap-3 text-3xl font-semibold mb-4">
            <Shield className="text-primary" /> What is Quishing?
          </h2>
          <p className="text-muted-foreground">
            Quishing (QR code phishing) is a type of social engineering attack where malicious actors use QR codes 
            to trick victims into visiting fake websites and entering sensitive information.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-3 text-3xl font-semibold mb-4">
            <AlertTriangle className="text-yellow-400" /> How Attackers Use QR Codes
          </h2>
          <ul className="text-muted-foreground space-y-2 list-disc ml-6">
            <li>QR codes can lead to malicious sites without revealing the destination URL beforehand.</li>
            <li>They exploit trust in quick actions (“scan to pay / verify / claim”).</li>
            <li>Attackers often place them in public areas or send them via email.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Real-World Examples</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'Fake Parking Meters', desc: 'QR codes stuck on parking meters leading to fake payment pages.' },
              { title: 'Fake Microsoft Login', desc: 'QR codes emailed as “urgent login required” that redirect to credential harvesters.' },
              { title: 'Fake Scholarship QR', desc: 'QR codes promising grants that steal student credentials.' },
            ].map((ex, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6">
                <div className="font-medium">{ex.title}</div>
                <p className="mt-3 text-muted-foreground text-sm">{ex.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Warning Signs to Look For</h2>
          <div className="text-muted-foreground space-y-4">
            <p>• Unknown sender or unexpected QR placement</p>
            <p>• Urgent language or “limited time” pressure</p>
            <p>• Poor design or spelling mistakes on the landing page</p>
            <p>• The QR code is printed on a sticker over an official one</p>
          </div>
        </section>
      </div>

      <div className="mt-12 flex justify-end">
        <button
          onClick={markComplete}
          disabled={marking}
          className="px-10 py-4 rounded-2xl bg-primary text-lg disabled:opacity-60"
        >
          {marking ? 'Marking Complete...' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
}
