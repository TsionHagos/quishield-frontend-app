'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function CaughtPage() {
  const [timestamp, setTimestamp] = useState('');
  const userId = typeof window !== 'undefined' ? sessionStorage.getItem('userId') || 'user-1' : 'user-1';

  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="caught-banner py-8 text-center text-white">
        <div className="max-w-2xl mx-auto px-6">
          <AlertTriangle className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-5xl font-bold tracking-tight mb-3">⚠️ THIS WAS A CYBERSECURITY AWARENESS SIMULATION</h1>
          <p className="text-xl opacity-90">You just fell for a simulated quishing attack.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12 pb-20 space-y-16">
        {/* DETECTION */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">DETECTION</div>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight mb-8">What we detected</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'QR Scan', val: 'Completed' },
              { label: 'Form Submission', val: 'Executed' },
              { label: 'Credentials Entered', val: 'Captured' },
            ].map((d, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6">
                <div className="text-sm text-muted-foreground">{d.label}</div>
                <div className="text-2xl font-semibold mt-2">{d.val}</div>
                <div className="text-xs mt-3 text-muted-foreground">Timestamp: {timestamp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* IDENTIFICATION */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">IDENTIFICATION</div>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight mb-8">Who you are (digital footprint)</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
              <div><span className="text-muted-foreground">Browser:</span> <span className="font-semibold">Chrome 128</span></div>
              <div><span className="text-muted-foreground">Device:</span> <span className="font-semibold">{navigator.userAgent.includes('Mobile') ? 'Android/iOS Mobile' : 'Desktop'}</span></div>
              <div><span className="text-muted-foreground">Time of scan:</span> <span className="font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              <div><span className="text-muted-foreground">Risk Level:</span> <span className="font-semibold text-red-400">HIGH RISK</span></div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              You visited a fake login page and entered credentials — giving attackers everything they need.
            </div>
          </div>
        </div>

        {/* DEFENSE */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">DEFENSE</div>
          </div>
          <h2 className="text-4xl font-semibold tracking-tight mb-8">Learn from this — How to protect yourself</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="font-medium mb-4 text-lg">Red Flags Detected</div>
              <ul className="space-y-3">
                {['Suspicious urgency', 'Unknown sender', 'Unverified QR code', 'Too good to be true'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg">
                    <span className="text-emerald-400">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-medium mb-4 text-lg">Immediate Mitigation Steps</div>
              <div className="rounded-2xl border border-border bg-card p-7 space-y-3 text-sm leading-relaxed">
                <div>• Always verify QR codes before scanning</div>
                <div>• Never enter credentials on unfamiliar domains</div>
                <div>• Use trusted QR verification apps</div>
                <div>• Enable FIDO2 / Passkeys wherever possible</div>
                <div>• Report suspicious QR codes immediately</div>
              </div>
              <Link 
                href="/dashboard/training" 
                className="mt-6 block w-full text-center py-4 rounded-lg bg-primary hover:bg-primary/90 text-sm font-semibold tracking-wider"
              >
                START AWARENESS TRAINING →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
