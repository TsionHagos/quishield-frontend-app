'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

const MODULES = [
  {
    id: '1',
    number: 1,
    title: 'Recognizing Quishing',
    category: 'Awareness',
    description: 'Learn what quishing is and common attack patterns',
    route: '/training/recognizing-quishing',
  },
  {
    id: '2',
    number: 2,
    title: 'Safe QR Scanning',
    category: 'Prevention',
    description: 'Best practices for scanning QR codes safely',
    route: '/training/safe-qr-scanning',
  },
  {
    id: '3',
    number: 3,
    title: 'Mobile Security',
    category: 'Defense',
    description: 'Protect your mobile device from QR-based attacks',
    route: '/training/mobile-security',
  },
  {
    id: '4',
    number: 4,
    title: 'Reporting Suspicious QR Codes',
    category: 'Reporting',
    description: 'How to report phishing attempts effectively',
    route: '/training/reporting',
  },
];

interface ModuleProgress {
  id: string;
  module_id: number;
  completed: boolean;
}

export default function TrainingPage() {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  const userId = typeof window !== 'undefined' ? getUserIdFromToken() : null;

  const fetchProgress = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/awareness/progress/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // data is an array of { module_id, completed, ... }
      setProgress(data.map((p: any) => ({
        id: String(p.module_id),
        module_id: p.module_id,
        completed: p.completed === true
      })));
    } catch {
      toast.error('Failed to load training progress');
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = (moduleNumber: number) => {
    return progress.some(p => Number(p.id) === moduleNumber || Number(p.module_id) === moduleNumber);
  };

  const completedCount = progress.filter(p => p.completed === true).length;
  const totalModules = 4;
  const progressPct = Math.round((completedCount / totalModules) * 100);

  useEffect(() => {
    fetchProgress();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold tracking-tight mb-3">Awareness Training</h1>
      <p className="text-muted-foreground mb-10">Complete modules to improve your quishing defense skills</p>

      {!loading && (
        <div className="mb-10 rounded-2xl border border-border bg-card p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-2xl font-bold">{progressPct}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full">
            <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-2">{completedCount} of {totalModules} modules completed</div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading training modules...</div>
      ) : (
        <div className="space-y-4">
          {MODULES.map((module) => {
            const completed = isCompleted(module.number);
            return (
              <Link
                key={module.id}
                href={module.route}
                className="block rounded-2xl border border-border bg-card p-7 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl font-mono text-muted-foreground tracking-tighter">
                        {module.number}
                      </span>
                      <span className="px-3 py-0.5 text-xs rounded-full border border-border font-medium bg-background">
                        {module.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-2xl tracking-tight">{module.title}</h3>
                    <p className="text-muted-foreground mt-2 text-lg">{module.description}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full pt-1">
                    {completed ? (
                      <div className="text-emerald-400 text-sm font-medium px-4 py-1 bg-emerald-500/10 rounded-full">
                        ✓ Completed
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground px-4 py-1">Not started</div>
                    )}

                    <div className="mt-auto pt-6">
                      <div className={`text-sm px-6 py-2 rounded-xl font-medium transition-all ${completed ? 'bg-secondary text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                        {completed ? 'Review' : 'Start'}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
