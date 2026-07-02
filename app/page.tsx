'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl text-center">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-16 h-16 text-primary shield-icon" />
            <span className="text-6xl font-bold tracking-tighter">QuisShield</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          Stop QR Code Phishing.<br />Train. Detect. Defend.
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          The complete quishing awareness platform. Learn to spot malicious QR codes, 
          complete training, and never fall for the next fake delivery notice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login"
            className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-10 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.985]"
          >
            Get Started — Login
          </Link>
          <Link 
            href="/register"
            className="inline-flex h-14 items-center justify-center rounded-lg border border-border px-10 text-lg font-medium hover:bg-secondary transition-all"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-16 text-sm text-muted-foreground">
          Trusted by security teams to simulate real-world quishing attacks
        </div>
      </div>
    </div>
  );
}
